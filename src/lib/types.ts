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

export type Fields = {
  age_over_18: boolean;
  age_over_13: boolean;
  age_over_15: boolean;
  age_over_16: boolean;
  age_over_21: boolean;
  age_over_23: boolean;
  age_over_25: boolean;
  age_over_27: boolean;
  age_over_28: boolean;
  age_over_40: boolean;
  age_over_60: boolean;
  age_over_65: boolean;
  age_over_67: boolean;
  /* issue_date: boolean;
  expiry_date: boolean;
  issuing_authority: boolean;
  issuing_jurisdiction: boolean;
  issuing_country: boolean;*/
};

export type PresentationFields = {
  path: string[];
};

export type TrustInfo = {
  issuer_in_trusted_list: boolean;
  issuer_not_expired: boolean;
  trusted_list_source: string;
  valid_from: string;
  valid_until: string;
  validation_errors: string[];
  is_fully_trusted: boolean;
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
  trust_info: TrustInfo[];
};

export type DcApiResponse = {
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

export interface DigitalCredentialRequestOptions {
  requests: IdentityRequestProvider[];
}

export interface CredentialRequestOptions {
  digital?: DigitalCredentialRequestOptions;
  mediation?: 'required' | 'optional' | 'silent';
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
