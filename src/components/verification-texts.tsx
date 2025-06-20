// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

export default function VerificationTexts({
  verifiedData,
}: {
  verifiedData:
    | {
        key: string;
        value: string | number | boolean;
      }[]
    | null;
}) {
  return (
    <div className="w-3/4 mx-4">
      <h2 className="text-2xl font-medium mt-8">Prove your age</h2>
      <p className="mt-2">
        {verifiedData
          ? verifiedData.filter(
              (item) => item.key === 'eu.europa.ec.av.1:age_over_18'
            )[0]?.value === 'true'
            ? 'You have successfully proven your age'
            : 'You have not been able to prove that you are over 18 years old'
          : 'You must be at least 18 years old'}
      </p>
    </div>
  );
}
