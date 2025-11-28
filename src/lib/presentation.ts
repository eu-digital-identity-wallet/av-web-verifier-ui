// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { type PresentationFields, type PresentationState } from './types';
import { v4 as uuidv4 } from 'uuid';

const verifierUrl = import.meta.env.VITE_VERIFIER_BASE_URL;

export async function CreatePresentationRequest(fields: PresentationFields[]) {
  const response = await fetch(verifierUrl + '/ui/presentations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'vp_token',
      dcql_query: {
        credentials: [
          {
            id: 'proof_of_age',
            format: 'mso_mdoc',
            meta: {
              doctype_value: 'eu.europa.ec.av.1',
            },
            claims: [...fields],
          },
        ],
      },
      nonce: uuidv4(),
    }),
  });
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    if (response.status === 400) {
      errorMessage =
        'Verifier failed to retrieve wallet response. Cause: Presentation should be in Submitted state but is in eu.europa.ec.eudi.verifier.endpoint.domain.Presentation$RequestObjectRetrieved';
    } else {
      try {
        const errorText = await response.text();
        if (errorText) {
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            } else {
              errorMessage = errorText;
            }
          } catch {
            errorMessage = errorText;
          }
        }
      } catch {
        // If reading response fails, use default HTTP error message
      }
    }
    throw new Error(errorMessage);
  }
  const data = await response.json();
  return data;
}

export async function GetPresentationState(
  transactionID: string
): Promise<PresentationState> {
  const response = await fetch(
    verifierUrl + `/ui/presentations/${transactionID}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    if (response.status === 400) {
      errorMessage =
        'Verifier failed to retrieve wallet response. Cause: Presentation should be in Submitted state but is in eu.europa.ec.eudi.verifier.endpoint.domain.Presentation$RequestObjectRetrieved';
    } else {
      try {
        const errorText = await response.text();
        if (errorText) {
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            } else if (errorData.cause) {
              errorMessage = `Verifier failed to retrieve wallet response. Cause: ${errorData.cause}`;
            } else if (typeof errorData === 'string') {
              errorMessage = errorData;
            } else {
              errorMessage = errorText;
            }
          } catch {
            errorMessage = errorText;
          }
        }
      } catch {
        // If reading response fails, use default HTTP error message
      }
    }
    throw new Error(errorMessage);
  }
  const data = await response.json();
  return data;
}
