// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

export type PresentedAttestation = Errored | Single | Enveloped;

export enum AttestationFormat {
  MSO_MDOC = 'mso_mdoc',
  SD_JWT_VC = 'vc+sd-jwt',
  JWT_VC_JSON = 'jwt_vc_json',
}

export interface KeyValue<K, V> {
  key: K;
  value: V;
}

export type VerifiedAttribute = {
  key: string;
  value: string | number | boolean;
};

export type Single = {
  kind: 'single';
  format: AttestationFormat;
  name: string;
  attributes: KeyValue<string, string>[];
  metadata: KeyValue<string, string>[];
};

export type Enveloped = {
  kind: 'enveloped';
  attestations: Single[];
};

export type Errored = {
  kind: 'error';
  format: AttestationFormat;
  reason: string;
};

export const AGE_THRESHOLDS = [
  13, 15, 16, 18, 21, 23, 25, 27, 28, 40, 60, 65, 67,
] as const;
export type AgeThreshold = (typeof AGE_THRESHOLDS)[number];
export type AgeField = `age_over_${AgeThreshold}`;
export type Fields = Record<AgeField, boolean>;

export const AV_NAMESPACE = 'eu.europa.ec.av.1';
export const AGE_OVER_18_KEY: AgeField = 'age_over_18';

export type PresentationFields = {
  path: string[];
};

// Verdict of a single validation check, as emitted by the verifier.
export type CheckStatus = 'passed' | 'skipped' | 'failed';

export type CheckOutcome = {
  status: CheckStatus;
  // Human-readable explanation, present for failed (and optionally skipped) checks.
  detail?: string;
};

// The mso_mdoc check identifiers emitted by the verifier (MsoMdocCheck enum names).
export type MsoMdocCheck =
  | 'IssuerChainTrusted'
  | 'ValidityInfoPresent'
  | 'NotExpired'
  | 'IssuerKeyIsEC'
  | 'IssuerSignatureValid'
  | 'DocumentTypeMatches'
  | 'IssuerSignedItemsValid'
  | 'NotRevoked'
  | 'DeviceSignedPresent'
  | 'DeviceKeyAuthorized'
  | 'DeviceKeyValid'
  | 'DeviceSignatureValid';

export type DocumentTrustInfo = {
  index: number;
  document_type: string;
  valid: boolean;
  checks: Partial<Record<MsoMdocCheck, CheckOutcome>>;
};

// The per-check trust report returned under `trust_info` by the verifier's
// get-wallet-response endpoint (only present when always-accept mode is enabled).
export type TrustInfo = {
  trusted: boolean;
  documents: DocumentTrustInfo[];
};

export type PresentationState = {
  vp_token: {
    proof_of_age: string;
  };
  presentation_submission: {
    id: string;
    definition_id: string;
    descriptor_map: Array<{
      id: string;
      format: string;
      path: string;
    }>;
  };
  // Present only when the verifier runs in always-accept mode.
  trust_info?: TrustInfo;
};

export type DcApiChallenge = {
  sessionId: string;
  dcRequestProtocol: string;
  dcRequestString: string;
  dcRequestProtocol2: string | null;
  dcRequestString2: string | null;
};

export interface IdentityRequestProvider {
  protocol: string;
  data: object;
}

export interface DcApiDeviceResponse {
  pages: Page[];
}

export interface Page {
  lines: Line[];
}

export interface Line {
  key: string;
  value: string;
}

export type MdocElement = {
  elementIdentifier: string;
  elementValue: unknown;
};

export type IssuerSignedItem = {
  value: Uint8Array;
};

export type MdocDocument = {
  docType: string;
  issuerSigned: {
    nameSpaces: Record<string, IssuerSignedItem[]>;
  };
};

export type MdocDeviceResponse = {
  documents: MdocDocument[];
};

export type VerificationResult =
  | {
      source: 'dc-api';
      attributes: VerifiedAttribute[];
      trust: TrustInfo | null;
      zkProofValidated: boolean;
    }
  | {
      source: 'openid4vp';
      attributes: VerifiedAttribute[];
      trust: TrustInfo | null;
    };

export type TransactionLogType =
  | 'initialized'
  | 'polling'
  | 'success'
  | 'error';

export interface TransactionLog {
  id: string;
  timestamp: Date;
  type: TransactionLogType;
  transactionId?: string;
  request?: unknown;
  response?: unknown;
  error?: string;
}
