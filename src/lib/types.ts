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
  issue_date: boolean;
  expiry_date: boolean;
  issuing_authority: boolean;
  issuing_jurisdiction: boolean;
  issuing_country: boolean;
};

export type PresentationFields = {
  path: string[];
  intent_to_retain: boolean;
};
