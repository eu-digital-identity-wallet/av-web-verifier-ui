import { QRCodeSVG } from 'qrcode.react';

export default function QrCode({
  data,
}: {
  data: { client_id: string; request_uri: string; request_uri_method: string };
}) {
  return (
    <QRCodeSVG
      value={`eudi-openid4vp://?client_id=${encodeURIComponent(
        data.client_id
      )}&request_uri=${encodeURIComponent(
        data.request_uri
      )}&request_uri_method=${encodeURIComponent(data.request_uri_method)}`}
      className=" rounded h-full max-h-96 w-auto"
    />
  );
}
