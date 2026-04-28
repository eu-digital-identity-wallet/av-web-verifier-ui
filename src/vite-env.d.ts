// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VERIFIER_BASE_URL: string;
  readonly VITE_DC_API_VERIFIER_BASE_URL: string;
  readonly VITE_FEATURE_FLAG_DC_API: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface IdentityRequestProvider {
    protocol: string;
    data: object;
  }

  interface DigitalCredentialRequestOptions {
    requests: IdentityRequestProvider[];
  }

  interface CredentialRequestOptions {
    digital?: DigitalCredentialRequestOptions;
    mediation?: 'required' | 'optional' | 'silent';
  }

  interface DigitalCredential extends Credential {
    readonly protocol: string;
    readonly data: string | object;
  }
}

export {};
