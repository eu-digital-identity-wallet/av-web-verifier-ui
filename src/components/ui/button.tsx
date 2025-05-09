// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export default function Button({
  text,
  className,
  ...props
}: { text: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={clsx(
        'py-2 px-4 cursor-pointer border border-gray-300 bg-gray-200 hover:bg-gray-300 rounded',
        className
      )}
    >
      {text}
    </button>
  );
}
