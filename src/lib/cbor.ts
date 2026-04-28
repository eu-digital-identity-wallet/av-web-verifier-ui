// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { Buffer } from 'buffer';
import { decode as cborDecode } from 'cbor-x';
import {
  AttestationFormat,
  KeyValue,
  MdocDeviceResponse,
  MdocDocument,
  MdocElement,
  PresentedAttestation,
  Single,
} from './types';

const BASE64URL_REGEX = /^[A-Za-z0-9-_]+$/;

// The backend wraps the base64url-encoded DeviceResponse in an array (OpenID4VP
// draft 24). We currently only process the first entry.
export function decode(attestation: string): PresentedAttestation[] {
  const buffer = decodeBase64OrHex(attestation[0]);
  const decodedData = decodeCborData(buffer) as MdocDeviceResponse | null;
  if (!decodedData) {
    return [];
  }

  if (decodedData.documents.length === 1) {
    return [extractAttestationSingle(decodedData.documents[0])];
  }
  return decodedData.documents.map(extractAttestationSingle);
}

function extractAttestationSingle(document: MdocDocument): Single {
  const { nameSpaces } = document.issuerSigned;
  const attributes: KeyValue<string, string>[] = Object.entries(
    nameSpaces
  ).flatMap(([namespace, items]) =>
    items.map((item) => {
      const element = decodeCborData(item.value) as MdocElement;
      return {
        key: `${namespace}:${element.elementIdentifier}`,
        value: elementAsString(element.elementValue),
      };
    })
  );

  return {
    kind: 'single',
    format: AttestationFormat.MSO_MDOC,
    name: document.docType,
    attributes,
    metadata: [],
  };
}

function decodeBase64OrHex(input: string): Buffer {
  if (BASE64URL_REGEX.test(input)) {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    return Buffer.from(base64, 'base64');
  }
  return Buffer.from(input, 'hex');
}

function decodeCborData(data: Uint8Array): unknown | null {
  try {
    return cborDecode(data);
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
