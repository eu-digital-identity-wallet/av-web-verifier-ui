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
      path: ["$['eu.europa.ec.agev10n']['age_over_18']"],
      intent_to_retain: false,
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
        path: [`$['eu.europa.ec.agev10n']['${key}']`],
        intent_to_retain: false,
      }));
    setPresentationFields(newPresentationFields);
    query.refetch();
  }

  useEffect(() => {
    if (state.data && state.data.vp_token && state.data.vp_token[0]) {
      try {
        const decodedData = decode(state.data.vp_token[0]);

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
    <div className="flex justify-center h-screen">
      <div className="w-1/2 mt-8">
        <Header />
        <VerificationTexts verifiedData={verifiedData} />
        {!query.isLoading && state.status !== 'success' ? (
          <div className="h-1/2">
            <div className="flex justify-center h-full mt-12">
              <QrCode data={query.data} />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setIsConfiguring(true)} text="configure" />
              <ConfigureDialog
                isOpen={isConfiguring}
                setIsOpen={setIsConfiguring}
                updateQuery={updateQuery}
              />
            </div>
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
      </div>
      <Footer />
    </div>
  );
}

export default App;
