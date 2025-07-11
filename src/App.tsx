// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { useQuery } from '@tanstack/react-query';
import {
  CreatePresentationRequest,
  GetPresentationState,
} from './lib/presentation';
import { type PresentationFields, Fields } from './lib/types';
import { decode } from './lib/cbor';
import { useEffect, useState } from 'react';
import DetailDialog from './components/detail-dialog';
import Button from './components/ui/button';
import QrCode from './components/qr-code';
import Header from './components/header';
import Footer from './components/footer';
import ConfigureDialog from './components/configure-dialog';
import VerificationTexts from './components/verification-texts';

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

  const query = useQuery({
    queryKey: ['proofRequest', presentationFields],
    queryFn: async () => CreatePresentationRequest(presentationFields),
    refetchOnWindowFocus: false,
  });

  const state = useQuery({
    queryKey: ['proofState', query.data?.transaction_id],
    queryFn: async () => GetPresentationState(query.data.transaction_id),
    enabled: !!query.data?.transaction_id && verifiedData === null,
    refetchInterval: 1500,
  });

  function updateQuery(fields: Fields) {
    setIsConfiguring(false);
    const newPresentationFields: PresentationFields[] = Object.keys(fields)
      .filter((key) => fields[key as keyof Fields] === true)
      .map((key) => ({
        path: ['eu.europa.ec.av.1', key],
      }));
    setPresentationFields(newPresentationFields);
    query.refetch();
  }

  useEffect(() => {
    if (state.data && state.data.vp_token && state.data.vp_token.proof_of_age) {
      try {
        const decodedData = decode(state.data.vp_token.proof_of_age);

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

    return () => {
      setVerifiedData(null);
    };
  }, [state.data]);

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full sm:w-1/2 flex flex-col p-4">
        <Header
          openConfigureDialog={isConfiguring}
          setOpenCofigureDialog={setIsConfiguring}
        />
        <main className="flex-grow flex flex-col">
          <VerificationTexts verifiedData={verifiedData} />
          {!query.isLoading && state.status !== 'success' ? (
            <div className="mt-8">
              <div
                className="flex justify-center"
                style={{ flexDirection: 'column' }}
              >
                {query.data?.request && <QrCode data={query.data.request} />}
              </div>
              <ConfigureDialog
                isOpen={isConfiguring}
                setIsOpen={setIsConfiguring}
                updateQuery={updateQuery}
              />
            </div>
          ) : (
            <div className="mx-4 flex flex-row gap-4 mt-4">
              {state.status === 'success' && (
                <>
                  <Button onClick={() => setIsOpen(true)} text="Show details" />
                  <Button onClick={() => query.refetch()} text="New Request" />
                  <DetailDialog
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    verifiedData={verifiedData}
                  />
                </>
              )}
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
