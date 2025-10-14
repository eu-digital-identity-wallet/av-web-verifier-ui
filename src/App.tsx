// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CreatePresentationRequest,
  GetPresentationState,
} from './lib/presentation';
import {
  type PresentationFields,
  Fields,
  TrustInfo,
  DcApiDeviceResponse,
  PresentationState,
} from './lib/types';
import { decode } from './lib/cbor';
import { useEffect, useState } from 'react';
import DetailDialog from './components/detail-dialog';
import Button from './components/ui/button';
import QrCode from './components/qr-code';
import Header from './components/header';
import Footer from './components/footer';
import ConfigureDialog from './components/configure-dialog';
import VerificationTexts from './components/verification-texts';
import TrustInfoDisplay from './components/trust-info';
import { performDcApiVerification, shouldUseDcApi } from './lib/dc-api.ts';

function App() {
  const [verifiedData, setVerifiedData] = useState<
    | {
        key: string;
        value: string | number | boolean;
      }[]
    | null
  >(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [presentationFields, setPresentationFields] = useState<
    PresentationFields[]
  >([
    {
      path: ['eu.europa.ec.av.1', 'age_over_18'],
    },
  ]);
  const [trustInfo, setTrustInfo] = useState<TrustInfo[] | null>(null);

  const useDcApi = shouldUseDcApi();

  const query = useQuery({
    queryKey: ['proofRequest', presentationFields],
    queryFn: async () => CreatePresentationRequest(presentationFields),
    refetchOnWindowFocus: false,
  });

  const state = useQuery({
    queryKey: ['proofState', query.data?.transaction_id],
    queryFn: async () => GetPresentationState(query.data.transaction_id),
    enabled: !useDcApi && !!query.data?.transaction_id && verifiedData === null,
    refetchInterval: 1500,
  });

  function updateQuery(fields: Fields) {
    setIsConfiguring(false);
    const newPresentationFields: PresentationFields[] = Object.keys(fields)
      .filter((key) => fields[key as keyof Fields])
      .map((key) => ({
        path: ['eu.europa.ec.av.1', key],
      }));
    setPresentationFields(newPresentationFields);
    query.refetch();
    dcApiMutation.reset();
  }

  const dcApiMutation = useMutation({
    mutationFn: async () => performDcApiVerification(),
    onSuccess: (data) => {
      if (data) {
        processVerificationResult(data);
      }
    },
    onError: (error) => {
      console.error(error);
      alert(`Verification failed: ${error.message}`);
    },
  });

  function processVerificationResult(
    data: DcApiDeviceResponse | PresentationState
  ) {
    if ('pages' in data) {
      const allLines = data.pages.flatMap((page) => page.lines);
      setVerifiedData(allLines);
      const issuerLine = allLines.find((line) => line.key === 'Issuer');
      const isTrusted = issuerLine
        ? !String(issuerLine.value).includes('Not in trust list')
        : false;

      setTrustInfo([
        {
          issuer_in_trusted_list: isTrusted,
          is_fully_trusted: isTrusted,
        },
      ] as TrustInfo[]);
    } else if ('vp_token' in data) {
      if (data.trust_info) {
        setTrustInfo(data.trust_info);
      }
      try {
        const decodedData = decode(data.vp_token.proof_of_age);
        if (decodedData.length > 0) {
          const firstAttestation = decodedData[0];
          if (
            firstAttestation.kind === 'single' &&
            firstAttestation.attributes
          ) {
            setVerifiedData(firstAttestation.attributes);
          }
        }
      } catch (error) {
        console.error('Failed to decode attestation:', error);
      }
    }
  }

  const isAgeOver18 =
    !!verifiedData &&
    verifiedData.some((item) => {
      const keyMatch =
        item.key === 'eu.europa.ec.av.1:age_over_18' ||
        item.key === 'age_over_18';
      const val = item.value;
      const valueTrue =
        val === true || val === 'true' || val === 1 || val === '1';
      return keyMatch && valueTrue;
    });

  useEffect(() => {
    console.log('state.data', state.data);
    if (state.data && state.data.vp_token && state.data.vp_token.proof_of_age) {
      processVerificationResult(state.data);
    }

    return () => {
      setVerifiedData(null);
      setTrustInfo(null);
    };
  }, [state.data]);

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full sm:w-1/2 flex flex-col p-4">
        <Header
          openConfigureDialog={isConfiguring}
          setOpenCofigureDialog={setIsConfiguring}
        />
        <main className="flex-grow flex flex-col px-4">
          <VerificationTexts verifiedData={verifiedData} />

          {trustInfo && verifiedData && (
            <TrustInfoDisplay trustInfo={trustInfo} isAgeOver18={isAgeOver18} />
          )}

          {!verifiedData ? (
            <div className="mt-8">
              <div
                className="flex justify-center items-center"
                style={{ flexDirection: 'column', minHeight: '300px' }}
              >
                {useDcApi ? (
                  <Button
                    onClick={() => dcApiMutation.mutate()}
                    text={
                      dcApiMutation.isPending
                        ? 'Waiting for wallet...'
                        : 'Verify with Wallet'
                    }
                    disabled={dcApiMutation.isPending}
                    className="py-4 px-8 text-lg"
                  />
                ) : (
                  query.data?.request && <QrCode data={query.data.request} />
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-row gap-4 mt-4">
              {verifiedData && (
                <>
                  <Button onClick={() => setIsOpen(true)} text="Show details" />
                  {/*<Button onClick={() => updateQuery({ age_over_18: true })} text="New Request" />*/}
                  <DetailDialog
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    verifiedData={verifiedData}
                  />
                </>
              )}
            </div>
          )}
          <ConfigureDialog
            isOpen={isConfiguring}
            setIsOpen={setIsConfiguring}
            updateQuery={updateQuery}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
