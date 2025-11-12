// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { TrustInfo } from '../lib/types';

interface TrustInfoDisplayProps {
  trustInfo: TrustInfo[];
  isAgeOver18: boolean;
  usedDcApi: boolean;
}

interface TrustCheckItemProps {
  label: string;
  isValid: boolean;
  description?: string;
}

function TrustCheckItem({ label, isValid, description }: TrustCheckItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center ${
              isValid
                ? 'bg-green-100 text-green-600'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {isValid ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{label}</h3>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>
      <div
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
      >
        {isValid ? 'Verified' : 'Not verified'}
      </div>
    </div>
  );
}

export default function TrustInfoDisplay({
  trustInfo,
  isAgeOver18,
}: TrustInfoDisplayProps) {
  if (!trustInfo || trustInfo.length === 0) {
    return null;
  }

  const trust = trustInfo[0]; // Take the first trust info object

  const checks = [
    {
      label: 'Issuer is trusted',
      isValid: trust.issuer_in_trusted_list,
      description: ``,
    },
    {
      label: 'Issuer has not expired',
      isValid: trust.issuer_in_trusted_list,
      description: ``,
    },
    {
      label: 'Age over 18 confirmed',
      isValid: isAgeOver18,
      description: '',
    },
  ];

  const overallTrustScore = checks.filter((check) => check.isValid).length;
  const totalChecks = checks.length;

  return (
    <div className="w-full mt-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Attestation Trustworthiness
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              overallTrustScore === totalChecks
                ? 'bg-green-100 text-green-800'
                : overallTrustScore > 0
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}
          >
            {overallTrustScore}/{totalChecks} checks passed
          </div>
          {trust.is_fully_trusted && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Fully trusted
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {checks.map((check, index) => (
          <TrustCheckItem
            key={index}
            label={check.label}
            isValid={check.isValid}
            description={check.description}
          />
        ))}
      </div>

      {trust.validation_errors && trust.validation_errors.length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="font-medium text-red-800 mb-2">Validation errors:</h4>
          <ul className="list-disc list-inside text-sm text-red-700">
            {trust.validation_errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
