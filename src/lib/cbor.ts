// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { Buffer } from 'buffer';
import { decode as CborDecode } from 'cbor-x';
import {
  PresentedAttestation,
  Single,
  KeyValue,
  AttestationFormat,
} from './types';

export function decode(attestation: string): PresentedAttestation[] {
  const buffer = decodeBase64OrHex(attestation);
  //const buffer = decodeBase64OrHex(attestation[0]); // TODO openid4vp draft 24 = const buffer = decodeBase64OrHex(attestation);
  const decodedData = decodeCborData(buffer) as { documents: unknown[] };

  if (decodedData.documents.length === 1) {
    return [extractAttestationSingle(decodedData.documents[0])];
  } else {
    return decodedData.documents.map((doc) => extractAttestationSingle(doc));
  }
}

function extractAttestationSingle(document: unknown): Single {
  const namespaces = (
    document as {
      issuerSigned: { nameSpaces: Record<string, { value: Uint8Array }[]> };
    }
  ).issuerSigned.nameSpaces;
  const attributes: KeyValue<string, string>[] = [];

  Object.keys(namespaces).forEach((it: string) => {
    const namespace = namespaces[it];
    for (const element of namespace) {
      const decodedElement = decodeCborData(element.value);
      attributes.push({
        key:
          it +
          ':' +
          (decodedElement as { elementIdentifier: string }).elementIdentifier,
        value: elementAsString(
          (decodedElement as { elementValue: unknown }).elementValue
        ),
      });
    }
  });
  return {
    kind: 'single',
    format: AttestationFormat.MSO_MDOC,
    name: (document as { docType: string })['docType'],
    attributes: attributes,
    metadata: [],
  };
}

function decodeBase64OrHex(input: string): Buffer {
  const base64Regex = /^[A-Za-z0-9-_]+$/;
  console.log('input', input);
  if (base64Regex.test(input)) {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64');
  }
  return Buffer.from(input, 'hex');
}

function decodeCborData(data: Uint8Array): unknown | null {
  try {
    return CborDecode(data);
  } catch (error) {
    console.error('Failed to decode CBOR:', error);
    return null;
  }
}

export function elementAsString(
  element: { [key: string]: unknown } | string[] | unknown | null,
  prepend?: string
): string {
  if (typeof element === 'object') {
    if (Array.isArray(element)) {
      return (element as string[])
        .map((it) => {
          return JSON.stringify(it);
        })
        .join(', ');
    } else {
      let str = '';
      if (typeof prepend !== 'undefined') {
        str += '<br/>';
      } else {
        prepend = '';
      }

      if (
        element &&
        'value' in element &&
        typeof (element as { value: unknown }).value === 'string'
      ) {
        return (element as { value: string }).value;
      }

      return (
        str +
        (element
          ? Object.keys(element)
              .map((it) => {
                return (
                  prepend +
                  '&nbsp;&nbsp;' +
                  it +
                  ': ' +
                  elementAsString(
                    (element as Record<string, unknown>)[it],
                    '&nbsp;&nbsp;'
                  ).toString()
                );
              })
              .join('<br/>')
          : '')
      );
    }
  } else {
    return (element ?? '').toString();
  }
}
