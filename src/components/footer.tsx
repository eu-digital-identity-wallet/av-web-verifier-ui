// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

export default function Footer() {
  return (
    <div className="fixed bottom-0 left-0 w-full border-t border-t-gray-600 bg-white">
      <p className="py-2 text-center text-xs font-medium text-gray-600">
        This verifier is compatible with{' '}
        <a
          className="text-indigo-800 underline"
          href="https://openid.net/specs/openid-4-verifiable-presentations-1_0-23.html"
        >
          OpenID4VP Draft 23
        </a>
      </p>
    </div>
  );
}
