// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { decode } from '../lib/cbor';
import { performDcApiVerification } from '../lib/dc-api';
import {
  CreatePresentationRequest,
  GetPresentationState,
} from '../lib/presentation';
import {
  AV_NAMESPACE,
  DcApiDeviceResponse,
  PresentationFields,
  PresentationState,
  TransactionLog,
  TransactionLogType,
  TrustInfo,
  VerifiedAttribute,
} from '../lib/types';

const DEFAULT_FIELDS: PresentationFields[] = [
  { path: ['eu.europa.ec.av.1', 'age_over_18'] },
];
const POLL_INTERVAL_MS = 1500;

type LogPayload = {
  transactionId?: string;
  request?: unknown;
  response?: unknown;
  error?: string;
};

export type UseAgeVerification = ReturnType<typeof useAgeVerification>;

export function useAgeVerification(useDcApi: boolean) {
  const [presentationFields, setPresentationFields] =
    useState<PresentationFields[]>(DEFAULT_FIELDS);
  const [verifiedData, setVerifiedData] = useState<VerifiedAttribute[] | null>(
    null
  );
  const [trustInfo, setTrustInfo] = useState<TrustInfo | null>(null);
  const [usedDcApi, setUsedDcApi] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [zkProofValidated, setZkProofValidated] = useState<boolean | null>(
    null
  );
  const [transactionLogs, setTransactionLogs] = useState<TransactionLog[]>([]);

  const addLog = useCallback(
    (type: TransactionLogType, options: LogPayload = {}) => {
      setTransactionLogs((prev) => [
        ...prev,
        { id: uuidv4(), timestamp: new Date(), type, ...options },
      ]);
    },
    []
  );

  const resetVerification = useCallback(() => {
    setVerifiedData(null);
    setTrustInfo(null);
    setUsedDcApi(false);
    setZkProofValidated(null);
  }, []);

  const query = useQuery({
    queryKey: ['proofRequest', presentationFields],
    queryFn: async () => {
      const request = { type: 'vp_token', fields: presentationFields };
      const response = await CreatePresentationRequest(presentationFields);
      addLog('initialized', {
        transactionId: response.transaction_id,
        request,
        response,
      });
      return response;
    },
    refetchOnWindowFocus: false,
  });

  const transactionId = query.data?.transaction_id as string | undefined;

  const state = useQuery({
    queryKey: ['proofState', transactionId],
    queryFn: async () => {
      try {
        const response = await GetPresentationState(transactionId!);
        addLog('polling', { transactionId, response });
        return response;
      } catch (error) {
        addLog('error', {
          transactionId,
          error:
            error instanceof Error ? error.message : 'Unknown polling error',
        });
        throw error;
      }
    },
    enabled:
      !!transactionId &&
      verifiedData === null &&
      (useDcApi || (!useDcApi && showQrCode)),
    refetchInterval: POLL_INTERVAL_MS,
    retry: false,
  });

  const processVerificationResult = useCallback(
    (data: DcApiDeviceResponse | PresentationState) => {
      if ('pages' in data) {
        const allLines = data.pages.flatMap((page) => page.lines);
        setVerifiedData(allLines);
        setUsedDcApi(true);

        const issuerLine = allLines.find((line) => line.key === 'Issuer');
        const isTrusted = issuerLine
          ? !String(issuerLine.value).includes('Not in trust list')
          : false;

        const zkProofLine = allLines.find((line) => line.key === 'ZK proof');
        setZkProofValidated(zkProofLine ? true : false);

        setTrustInfo({
          trusted: isTrusted,
          documents: [
            {
              index: 0,
              document_type: AV_NAMESPACE,
              valid: isTrusted,
              // The DC API path has no per-check report from the backend; it only
              // exposes a single trusted/untrusted signal, mirrored onto both checks.
              checks: {
                IssuerChainTrusted: {
                  status: isTrusted ? 'passed' : 'failed',
                },
                NotExpired: {
                  status: isTrusted ? 'passed' : 'failed',
                },
              },
            },
          ],
        });

        addLog('success', { response: data });
        return;
      }

      if ('vp_token' in data) {
        if (data.trust_info) {
          setTrustInfo(data.trust_info);
        }
        setUsedDcApi(false);
        setZkProofValidated(null);
        try {
          const decodedData = decode(data.vp_token.proof_of_age);
          const firstAttestation = decodedData[0];
          if (
            firstAttestation &&
            firstAttestation.kind === 'single' &&
            firstAttestation.attributes
          ) {
            setVerifiedData(firstAttestation.attributes);
            addLog('success', { transactionId, response: data });
          }
        } catch (error) {
          console.error('Failed to decode attestation:', error);
          addLog('error', {
            transactionId,
            error:
              error instanceof Error
                ? error.message
                : 'Failed to decode attestation',
          });
        }
      }
    },
    [addLog, transactionId]
  );

  const dcApiMutation = useMutation({
    mutationFn: async (requestId: string) => {
      addLog('initialized', {
        request: {
          method: 'DC API',
          origin: window.location.origin,
          requestId,
        },
      });
      return performDcApiVerification(requestId);
    },
    onSuccess: (data) => {
      if (data) {
        processVerificationResult(data);
      }
    },
    onError: (error) => {
      console.error(error);
      addLog('error', {
        error:
          error instanceof Error ? error.message : 'DC API verification failed',
      });
      alert(`Verification failed: ${error.message}`);
    },
  });

  useEffect(() => {
    const data = state.data;
    if (data && data.vp_token && data.vp_token.proof_of_age) {
      processVerificationResult(data);
    }
    return resetVerification;
  }, [state.data, processVerificationResult, resetVerification]);

  const updateFields = useCallback(
    (fields: PresentationFields[]) => {
      setPresentationFields(fields);
      setTransactionLogs([]);
      resetVerification();
      dcApiMutation.reset();
      setShowQrCode(false);
      query.refetch();
    },
    [dcApiMutation, query, resetVerification]
  );

  return {
    presentationFields,
    verifiedData,
    trustInfo,
    usedDcApi,
    zkProofValidated,
    transactionLogs,
    query,
    state,
    dcApiMutation,
    showQrCode,
    setShowQrCode,
    updateFields,
  };
}
