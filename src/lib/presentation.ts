// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { type PresentationFields } from './types';
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
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
}

export async function GetPresentationState(transactionID: string) {
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
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data;
}
