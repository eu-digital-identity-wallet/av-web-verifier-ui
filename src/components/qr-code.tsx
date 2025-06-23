// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { QRCodeSVG } from 'qrcode.react';
import { useState, useEffect } from 'react';

interface QrCodeData {
  data: string;
}

export default function QrCode(data: QrCodeData) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /*
  const handleQrClick = () => {
    if (isMobile) {
      setIsModalOpen(true);
    }
  };
  */

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex flex-col items-center">
        <div
          className={`${isMobile ? '' : ''}`}
          //onClick={handleQrClick}
          //title={isMobile ? 'Click to enlarge' : ''}
        >
          <QRCodeSVG
            value={parseJwtAndCreateUri(data)}
            className="rounded h-full w-auto"
            size={isMobile ? 400 : 500}
          />
        </div>
        <a
          href={parseJwtAndCreateUri(data)}
          className="mt-4 text-center"
          style={{ textDecoration: 'underline', color: 'blue' }}
        >
          For mobile login click here
        </a>
        {/* {isMobile && (
          <p className="text-sm text-gray-600 mt-2 text-center">
            💡 Tip: Click to enlarge the QR code
          </p> */}
      </div>

      {isModalOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Enlarged QR code</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="flex justify-center">
              <QRCodeSVG
                value={parseJwtAndCreateUri(data)}
                className="rounded w-full max-w-xs"
                size={256}
              />
            </div>
            <div className="mt-4 text-center">
              <a
                href={parseJwtAndCreateUri(data)}
                className="text-blue-600 underline"
              >
                Direct link for mobile login
              </a>
            </div>
            <div className="mt-4 text-center text-sm text-gray-600">
              Click outside the QR code to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function parseJwtAndCreateUri(token: QrCodeData): string {
  if (!token) {
    throw new Error('Token is undefined or empty');
  }
  const parts = token.data.split('.');
  if (parts.length !== 3) {
    throw new Error('Token does not have the expected 3 parts');
  }
  const base64Url = parts[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  const parsed = JSON.parse(jsonPayload);

  const request_new =
    'av' +
    '://' +
    '?client_id=redirect_uri:' +
    parsed.response_uri +
    '&response_type=' +
    parsed.response_type +
    '&response_mode=' +
    parsed.response_mode +
    '&response_uri=' +
    parsed.response_uri +
    '&presentation_definition_uri=' +
    parsed.presentation_definition_uri +
    '&dcql=null' +
    '&nonce=' +
    parsed.nonce +
    '&state=' +
    parsed.state;

  return request_new;
}
