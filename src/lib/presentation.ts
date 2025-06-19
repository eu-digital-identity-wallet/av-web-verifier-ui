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
      presentation_definition: {
        id: uuidv4(),
        input_descriptors: [
          {
            id: 'eu.europa.ec.agev10n',
            format: {
              mso_mdoc: {
                alg: ['ES256', 'ES384', 'ES512', 'EdDSA'],
              },
            },
            constraints: {
              limit_disclosure: 'required',
              fields: [...fields],
            },
          },
        ],
      },
      dcql_query: null,
      jar_mode: "by_value",
      response_mode: "direct_post",
      presentation_definition_mode: "by_reference",
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
