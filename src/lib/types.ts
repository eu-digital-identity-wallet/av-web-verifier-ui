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
