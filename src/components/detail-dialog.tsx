// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

export default function DetailDialog({
  isOpen,
  setIsOpen,
  verifiedData,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  verifiedData:
    | {
        key: string;
        value: string | number | boolean;
      }[]
    | null;
}) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-2xl space-y-4 border border-gray-500 rounded-lg bg-white p-12 shadow-xl">
          <DialogTitle className="font-bold">Verification Details</DialogTitle>
          <div className="space-y-2">
            {verifiedData &&
              verifiedData.map(({ key, value }, index) => (
                <div
                  key={index}
                  className="flex flex-row gap-4 justify-between"
                >
                  <p className="font-medium">
                    {key.substring(key.lastIndexOf(':') + 1)}:
                  </p>
                  <p className="text-gray-700">{value.toString()}</p>
                </div>
              ))}
          </div>
          <button
            className="px-4 cursor-pointer py-2 rounded bg-gray-200 border-gray-300 border-1"
            onClick={() => setIsOpen(false)}
          >
            Close
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
