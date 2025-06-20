// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { QRCodeSVG } from 'qrcode.react';

export default function QrCode(data: any) {
  return (
    <>
     <QRCodeSVG value={parseJwtAndCreateUri(data)}
      className="rounded h-full max-h-96 w-auto"
      />
      <a href={parseJwtAndCreateUri(data)} className='mt-4 text-center' style={{ textDecoration: 'underline', color:'blue' }}>For mobile login click here</a>
    </>
   
  );
}

function parseJwtAndCreateUri(token:any) {

    if (!token) {
        throw new Error("Token is undefined or empty");
    }
    var parts = token.data.split('.');
    if (parts.length !== 3) {
        throw new Error("Token does not have the expected 3 parts");
    }
    var base64Url = parts[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );
    var parsed = JSON.parse(jsonPayload);

    var request_new = "av"
    + "://" 
    + "?client_id=redirect_uri:" + parsed.response_uri
    + "&response_type=" + parsed.response_type
    + "&response_mode=" + parsed.response_mode
    + "&response_uri=" + parsed.response_uri
    + "&presentation_definition_uri=" + parsed.presentation_definition_uri
    + "&dcql=null"
    + "&nonce=" + parsed.nonce
    + "&state=" + parsed.state

    return request_new;
}
