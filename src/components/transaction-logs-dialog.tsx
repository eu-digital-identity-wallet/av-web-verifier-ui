// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';
import { TransactionLog } from '../lib/types';
import TransactionLogs from './transaction-logs';
import Button from './ui/button';

export default function TransactionLogsDialog({
  isOpen,
  setIsOpen,
  transactionLogs,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  transactionLogs: TransactionLog[];
}) {
  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-4xl w-full space-y-4 border border-gray-500 rounded-lg bg-white p-8 shadow-xl">
          <DialogTitle className="font-bold text-lg">
            Transaction Logs
          </DialogTitle>
          <p className="text-sm text-gray-700">
            View detailed logs of all verification transactions including
            requests, polling attempts, and responses.
          </p>

          <div className="border-t border-gray-300 pt-4">
            <TransactionLogs logs={transactionLogs} />
          </div>

          <div className="flex flex-row gap-4 pt-4 border-t border-gray-300">
            <Button text="Close" onClick={() => setIsOpen(false)} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
