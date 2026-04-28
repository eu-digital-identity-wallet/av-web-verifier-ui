// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { useMemo, useState } from 'react';
import ConfigureDialog from './components/configure-dialog';
import DetailDialog from './components/detail-dialog';
import Footer from './components/footer';
import Header from './components/header';
import QrCode from './components/qr-code';
import TransactionLogsDialog from './components/transaction-logs-dialog';
import TrustInfoDisplay from './components/trust-info';
import Button from './components/ui/button';
import VerificationTexts from './components/verification-texts';
import { useAgeVerification } from './hooks/use-age-verification';
import { shouldUseDcApi } from './lib/dc-api';
import {
  AV_NAMESPACE,
  AGE_OVER_18_KEY,
  Fields,
  PresentationFields,
} from './lib/types';

function App() {
  const [useDcApi] = useState(shouldUseDcApi);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [isTransactionLogsOpen, setIsTransactionLogsOpen] = useState(false);

  const {
    verifiedData,
    trustInfo,
    usedDcApi,
    zkProofValidated,
    transactionLogs,
    query,
    dcApiMutation,
    showQrCode,
    setShowQrCode,
    updateFields,
  } = useAgeVerification(useDcApi);

  const isAgeOver18 = useMemo(
    () => isAgeOver18Confirmed(verifiedData),
    [verifiedData]
  );

  const handleConfigure = (fields: Fields) => {
    setIsConfiguring(false);
    const newFields: PresentationFields[] = (
      Object.keys(fields) as Array<keyof Fields>
    )
      .filter((key) => fields[key])
      .map((key) => ({ path: [AV_NAMESPACE, key] }));
    updateFields(newFields);
  };

  return (
    <div className="flex justify-center min-h-screen">
      <div className="w-full sm:w-1/2 flex flex-col p-4">
        <Header
          openConfigureDialog={isConfiguring}
          setOpenConfigureDialog={setIsConfiguring}
          openTransactionLogsDialog={isTransactionLogsOpen}
          setOpenTransactionLogsDialog={setIsTransactionLogsOpen}
        />
        <main className="flex-grow flex flex-col px-4 mb-4">
          <VerificationTexts verifiedData={verifiedData} />

          {trustInfo && verifiedData && (
            <TrustInfoDisplay
              trustInfo={trustInfo}
              isAgeOver18={isAgeOver18}
              usedDcApi={usedDcApi}
              zkProofValidated={zkProofValidated}
            />
          )}

          {!verifiedData ? (
            <div className="mt-8">
              <div className="flex justify-center items-center flex-col min-h-[300px]">
                {useDcApi
                  ? query.data?.request && (
                      <>
                        <Button
                          onClick={() => dcApiMutation.mutate('age_over_18')}
                          text={
                            dcApiMutation.isPending
                              ? 'Waiting for wallet...'
                              : 'DC API'
                          }
                          disabled={dcApiMutation.isPending}
                          className="py-4 px-8 text-lg"
                        />
                        <Button
                          onClick={() =>
                            dcApiMutation.mutate('age_over_18_zkp')
                          }
                          text={
                            dcApiMutation.isPending
                              ? 'Waiting for wallet...'
                              : 'DC API (ZKP)'
                          }
                          disabled={dcApiMutation.isPending}
                          className="py-4 px-8 text-lg mt-4"
                        />
                        <Button
                          onClick={() => setShowQrCode(true)}
                          text="OpenID4VP"
                          disabled={dcApiMutation.isPending}
                          className="py-4 px-8 text-lg mt-4"
                        />
                        {showQrCode && (
                          <div className="mt-8">
                            <QrCode data={query.data.request} />
                          </div>
                        )}
                      </>
                    )
                  : query.data?.request && <QrCode data={query.data.request} />}
              </div>
            </div>
          ) : (
            <div className="flex flex-row gap-4 mt-4">
              <Button
                onClick={() => setIsDetailOpen(true)}
                text="Show details"
              />
              <DetailDialog
                isOpen={isDetailOpen}
                setIsOpen={setIsDetailOpen}
                verifiedData={verifiedData}
              />
            </div>
          )}
          <ConfigureDialog
            isOpen={isConfiguring}
            setIsOpen={setIsConfiguring}
            updateQuery={handleConfigure}
          />
          <TransactionLogsDialog
            isOpen={isTransactionLogsOpen}
            setIsOpen={setIsTransactionLogsOpen}
            transactionLogs={transactionLogs}
          />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function isAgeOver18Confirmed(
  verifiedData: { key: string; value: string | number | boolean }[] | null
): boolean {
  if (!verifiedData) return false;
  return verifiedData.some((item) => {
    const keyMatch =
      item.key === `${AV_NAMESPACE}:${AGE_OVER_18_KEY}` ||
      item.key === AGE_OVER_18_KEY;
    const val = item.value;
    const valueTrue =
      val === true ||
      val === 'true' ||
      val === 1 ||
      val === '1' ||
      val === '"true"';
    return keyMatch && valueTrue;
  });
}

export default App;
