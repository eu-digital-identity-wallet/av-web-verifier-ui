// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0
import {
  DcApiDeviceResponse,
  DcApiResponse,
  IdentityRequestProvider,
} from './types';

// const verifierUrl = import.meta.env.VITE_VERIFIER_BASE_URL;
// const featureFlagDcApi = import.meta.env.VITE_FEATURE_FLAG_DC_API === 'true';

const dcApiVerifierUrl = import.meta.env.VITE_DC_API_VERIFIER_BASE_URL;

/**
 * Checks if the Digital Credentials (DC) API is available in the browser.
 */
export function isDcApiAvailable(): boolean {
  return typeof window['DigitalCredential' as keyof Window] !== 'undefined';
}

/**
 * Determines if the DC-API flow should be used.
 */
export function shouldUseDcApi(): boolean {
  console.log('isDcApiAvailable', isDcApiAvailable());
  return isDcApiAvailable();
}

export async function performDcApiVerification() {
  const docType = 'eu.europa.ec.av.1';
  const claim = 'age_over_18';

  const challengeResponse = await fetch(
    `${dcApiVerifierUrl}/verifier/dcBegin`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        format: 'mdoc',
        docType: docType,
        requestId: claim,
        protocol: 'w3c_dc_mdoc_api',
        origin: window.location.origin,
        host: window.location.host,
        signRequest: false,
        encryptResponse: false,
      }),
    }
  );

  if (!challengeResponse.ok) {
    throw new Error('Failed to get challenge from dc-api.');
  }
  const challenge = (await challengeResponse.json()) as DcApiResponse;

  return await dcRequestCredential(
    challenge.sessionId,
    challenge.dcRequestProtocol,
    challenge.dcRequestString
  );
}

async function dcRequestCredential(
  sessionId: string,
  dcRequestProtocol: string,
  dcRequestString: string
) {
  if (!navigator.credentials || !navigator.credentials.get) {
    alert(
      'Digital Credentials API is not available. Please enable it via chrome://flags#web-identity-digital-credentials.'
    );
    return;
  }

  const providers: IdentityRequestProvider[] = [];
  try {
    providers.push({
      protocol: dcRequestProtocol,
      data: JSON.parse(dcRequestString),
    });

    console.log(providers);

    const credentialsResponse: Credential | null =
      await navigator.credentials.get({
        digital: {
          requests: providers,
        },
        mediation: 'required',
      });

    console.log(sessionId);

    if (credentialsResponse) {
      console.log('credentialsResponse');
      console.log(credentialsResponse);
      const dcResponse = await dcProcessResponse(
        sessionId,
        credentialsResponse
      );
      console.log(dcResponse);
      return dcResponse;
    }
  } catch (error) {
    alert(error);
  }
}

async function dcProcessResponse(
  sessionId: string,
  credentialsResponse: Credential
) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const digitalCredential = credentialsResponse as {
    protocol: string;
    data: string | object;
  };

  const dataStr =
    typeof digitalCredential.data === 'string'
      ? digitalCredential.data
      : JSON.stringify(digitalCredential.data);

  console.log(dataStr);

  const response = await fetch(
    'https://dc-openwallet-verifier-backend-gmfrdchkavechkbj.westeurope-01.azurewebsites.net/verifier/dcGetData',
    //'http://localhost:8006/verifier/dcGetData',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: sessionId,
        credentialProtocol: digitalCredential.protocol,
        credentialResponse: dataStr,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Backend verification failed: ${response.status} ${errorText}`
    );
  }

  return (await response.json()) as DcApiDeviceResponse;
}
