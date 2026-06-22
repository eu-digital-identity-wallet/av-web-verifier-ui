// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { CheckStatus, MsoMdocCheck, TrustInfo } from '../lib/types';

interface TrustInfoDisplayProps {
  trustInfo: TrustInfo;
  isAgeOver18: boolean;
  usedDcApi: boolean;
  zkProofValidated?: boolean | null;
}

// Human-readable labels for the verifier's mso_mdoc check identifiers.
const CHECK_LABELS: Record<MsoMdocCheck, string> = {
  IssuerChainTrusted: 'Issuer is trusted',
  IssuerSignatureValid: 'Issuer signature valid',
  IssuerKeyIsEC: 'Issuer key is valid',
  NotExpired: 'Issuer has not expired',
  ValidityInfoPresent: 'Validity information present',
  DocumentTypeMatches: 'Document type matches',
  IssuerSignedItemsValid: 'Issuer-signed data integrity',
  NotRevoked: 'Not revoked',
  DeviceSignedPresent: 'Device-signed data present',
  DeviceKeyAuthorized: 'Device key authorized',
  DeviceKeyValid: 'Device key valid',
  DeviceSignatureValid: 'Device signature valid',
};

// The curated subset of backend checks to display (in order). The verifier reports many more
// checks, but only these are surfaced in the UI; the overall verdict still reflects all of them.
const DISPLAYED_CHECKS: MsoMdocCheck[] = [
  'IssuerChainTrusted',
  'NotExpired',
  'DeviceSignatureValid',
];

type DisplayCheck = {
  label: string;
  status: CheckStatus;
  detail?: string;
};

interface TrustCheckItemProps {
  label: string;
  status: CheckStatus;
  detail?: string;
}

const STATUS_BADGE: Record<CheckStatus, { text: string; className: string }> = {
  passed: { text: 'Verified', className: 'bg-green-100 text-green-800' },
  failed: { text: 'Not verified', className: 'bg-red-100 text-red-800' },
  skipped: { text: 'Not checked', className: 'bg-gray-200 text-gray-600' },
};

function StatusIcon({ status }: { status: CheckStatus }) {
  if (status === 'passed') {
    return (
      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-green-100 text-green-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }
  if (status === 'failed') {
    return (
      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-red-100 text-red-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 text-gray-500">
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
}

function TrustCheckItem({ label, status, detail }: TrustCheckItemProps) {
  const badge = STATUS_BADGE[status];
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <StatusIcon status={status} />
          <div>
            <h3 className="font-medium text-gray-900">{label}</h3>
            {detail && <p className="text-sm text-gray-500 mt-1">{detail}</p>}
          </div>
        </div>
      </div>
      <div
        className={`px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}
      >
        {badge.text}
      </div>
    </div>
  );
}

export default function TrustInfoDisplay({
  trustInfo,
  isAgeOver18,
  zkProofValidated,
}: TrustInfoDisplayProps) {
  if (!trustInfo || trustInfo.documents.length === 0) {
    return null;
  }

  // The age-verification flow presents a single document.
  const documentTrust = trustInfo.documents[0];

  const backendChecks: DisplayCheck[] = DISPLAYED_CHECKS.filter(
    (name) => documentTrust.checks[name] !== undefined
  ).map((name) => {
    const outcome = documentTrust.checks[name]!;
    return {
      label: CHECK_LABELS[name],
      status: outcome.status,
      detail: outcome.detail,
    };
  });

  const derivedChecks: DisplayCheck[] = [
    {
      label: 'Age over 18 confirmed',
      status: isAgeOver18 ? 'passed' : 'failed',
    },
  ];

  if (zkProofValidated !== null && zkProofValidated !== undefined) {
    derivedChecks.push({
      label: 'ZK proof validated',
      status: zkProofValidated ? 'passed' : 'failed',
      detail: zkProofValidated ? 'Successfully validated proof' : undefined,
    });
  }

  const checks = [...backendChecks, ...derivedChecks];

  // Skipped checks are excluded from the score: they were not performed.
  const performedChecks = checks.filter((check) => check.status !== 'skipped');
  const passedChecks = performedChecks.filter(
    (check) => check.status === 'passed'
  ).length;
  const totalPerformed = performedChecks.length;

  return (
    <div className="w-full mt-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Attestation Trustworthiness
        </h2>
        <div className="flex items-center gap-2 mb-4">
          <div
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              passedChecks === totalPerformed
                ? 'bg-green-100 text-green-800'
                : passedChecks > 0
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}
          >
            {passedChecks}/{totalPerformed} checks passed
          </div>
          {trustInfo.trusted ? (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Fully trusted
            </div>
          ) : (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Not fully trusted
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {checks.map((check, index) => (
          <TrustCheckItem
            key={index}
            label={check.label}
            status={check.status}
            detail={check.detail}
          />
        ))}
      </div>
    </div>
  );
}
