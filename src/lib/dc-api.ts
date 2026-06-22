// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import {
  DcApiChallenge,
  DcApiDeviceResponse,
  IdentityRequestProvider,
} from './types';

const dcApiVerifierUrl = import.meta.env.VITE_DC_API_VERIFIER_BASE_URL;
const DOC_TYPE = 'eu.europa.ec.av.1';

export class DcApiUnavailableError extends Error {
  constructor() {
    super(
      'Digital Credentials API is not available. Please enable it via chrome://flags#web-identity-digital-credentials.'
    );
    this.name = 'DcApiUnavailableError';
  }
}

export function isDcApiAvailable(): boolean {
  return (
    typeof window['DigitalCredential' as keyof Window] !== 'undefined' &&
    typeof navigator.credentials?.get === 'function'
  );
}

export function shouldUseDcApi(): boolean {
  return isDcApiAvailable();
}

export async function performDcApiVerification(
  requestId: string
): Promise<DcApiDeviceResponse | undefined> {
  if (!isDcApiAvailable()) {
    throw new DcApiUnavailableError();
  }

  const challenge = await beginDcApiSession(requestId);
  const credential = await requestCredential(challenge);
  if (!credential) {
    return undefined;
  }
  return completeDcApiSession(challenge.sessionId, credential);
}

async function beginDcApiSession(requestId: string): Promise<DcApiChallenge> {
  const response = await fetch(`${dcApiVerifierUrl}/verifier/dcBegin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      format: 'mdoc',
      docType: DOC_TYPE,
      requestId,
      protocol: 'w3c_dc_mdoc_api',
      origin: window.location.origin,
      host: window.location.host,
      multiDocumentRequestId: '',
      rawDcql: '',
      signRequest: true,
      encryptResponse: true,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to get challenge from dc-api: ${response.status} ${response.statusText}`
    );
  }
  return (await response.json()) as DcApiChallenge;
}

async function requestCredential(
  challenge: DcApiChallenge
): Promise<DigitalCredential | null> {
  const providers: IdentityRequestProvider[] = [
    {
      protocol: challenge.dcRequestProtocol,
      data: JSON.parse(challenge.dcRequestString),
    },
  ];

  const response = await navigator.credentials.get({
    digital: { requests: providers },
    mediation: 'required',
  });

  return response as DigitalCredential | null;
}

async function completeDcApiSession(
  sessionId: string,
  credential: DigitalCredential
): Promise<DcApiDeviceResponse> {
  const dataStr =
    typeof credential.data === 'string'
      ? credential.data
      : JSON.stringify(credential.data);

  const response = await fetch(`${dcApiVerifierUrl}/verifier/dcGetData`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionId,
      credentialProtocol: credential.protocol,
      credentialResponse: dataStr,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Backend verification failed: ${response.status} ${errorText}`
    );
  }

  return (await response.json()) as DcApiDeviceResponse;
}
