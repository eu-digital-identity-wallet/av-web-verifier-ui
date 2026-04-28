// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { type PresentationFields, type PresentationState } from './types';
import { v4 as uuidv4 } from 'uuid';

const verifierUrl = import.meta.env.VITE_VERIFIER_BASE_URL;

const REQUEST_OBJECT_RETRIEVED_MESSAGE =
  'Verifier failed to retrieve wallet response. Cause: Presentation should be in Submitted state but is in eu.europa.ec.eudi.verifier.endpoint.domain.Presentation$RequestObjectRetrieved';

export async function CreatePresentationRequest(fields: PresentationFields[]) {
  const response = await fetch(`${verifierUrl}/ui/presentations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      type: 'vp_token',
      dcql_query: {
        credentials: [
          {
            id: 'proof_of_age',
            format: 'mso_mdoc',
            meta: { doctype_value: 'eu.europa.ec.av.1' },
            claims: [...fields],
          },
        ],
      },
      nonce: uuidv4(),
    }),
  });

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  return response.json();
}

export async function GetPresentationState(
  transactionID: string
): Promise<PresentationState> {
  const response = await fetch(
    `${verifierUrl}/ui/presentations/${transactionID}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response));
  }
  return (await response.json()) as PresentationState;
}

async function extractErrorMessage(response: Response): Promise<string> {
  if (response.status === 400) {
    return REQUEST_OBJECT_RETRIEVED_MESSAGE;
  }

  const fallback = `HTTP ${response.status}: ${response.statusText}`;
  let errorText: string;
  try {
    errorText = await response.text();
  } catch {
    return fallback;
  }
  if (!errorText) {
    return fallback;
  }

  try {
    const errorData = JSON.parse(errorText) as unknown;
    if (typeof errorData === 'string') {
      return errorData;
    }
    if (errorData && typeof errorData === 'object') {
      const data = errorData as Record<string, unknown>;
      if (typeof data.message === 'string') return data.message;
      if (typeof data.error === 'string') return data.error;
      if (typeof data.cause === 'string') {
        return `Verifier failed to retrieve wallet response. Cause: ${data.cause}`;
      }
    }
  } catch {
    // fall through to raw text
  }
  return errorText;
}
