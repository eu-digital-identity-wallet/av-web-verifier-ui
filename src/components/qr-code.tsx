// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT_PX = 768;

interface QrCodeProps {
  data: string;
}

export default function QrCode(props: QrCodeProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT_PX);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const uri = parseJwtAndCreateUri(props);

  return (
    <div className="flex flex-col items-center">
      <QRCodeSVG
        value={uri}
        className="rounded h-full w-auto"
        size={isMobile ? 400 : 500}
      />
      <a
        href={uri}
        className="mt-4 text-center"
        style={{ textDecoration: 'underline', color: 'blue' }}
      >
        For mobile login click here
      </a>
    </div>
  );
}

function parseJwtAndCreateUri(token: QrCodeProps): string {
  if (!token) {
    throw new Error('Token is undefined or empty');
  }
  const parts = token.data.split('.');
  if (parts.length !== 3) {
    throw new Error('Token does not have the expected 3 parts');
  }
  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  const parsed = JSON.parse(jsonPayload);

  return (
    'av://?' +
    'response_type=' +
    parsed.response_type +
    '&response_mode=' +
    parsed.response_mode +
    '&client_id=redirect_uri' +
    encodeURIComponent(':' + parsed.response_uri) +
    '&response_uri=' +
    encodeURIComponent(parsed.response_uri) +
    '&dcql_query=' +
    encodeURIComponent(JSON.stringify(parsed.dcql_query)) +
    '&nonce=' +
    parsed.nonce +
    '&state=' +
    parsed.state
  );
}
