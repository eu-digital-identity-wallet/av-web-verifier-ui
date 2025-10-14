// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

/// <reference types="vite/client" />

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ImportMetaEnv {
  readonly VITE_FEATURE_FLAG_DC_API: string;
}

declare global {
  interface Navigator {
    credentials: CredentialsContainer;
  }

  interface CredentialsContainer {
    get(options?: CredentialRequestOptions): Promise<Credential | null>;
  }

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
}

export {};
