// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import {
  Checkbox,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Field,
  Label,
} from '@headlessui/react';
import Button from './ui/button';
import { CheckIcon } from '@heroicons/react/16/solid';
import { useState } from 'react';
import { Fields } from '../lib/types';

export default function ConfigureDialog({
  isOpen,
  setIsOpen,
  updateQuery,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  updateQuery: (fields: Fields) => void;
}) {
  const [fields, setFields] = useState<Fields>({
    age_over_18: true,
    issue_date: false,
    expiry_date: false,
    issuing_authority: false,
    issuing_jurisdiction: false,
    issuing_country: false,
  });

  const toggleField = (field: keyof typeof fields) => {
    setFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const fieldLabels: { key: keyof Fields; label: string }[] = [
    { key: 'age_over_18', label: 'Age over 18' },
    /* { key: 'issue_date', label: 'Issuance date' },
    { key: 'expiry_date', label: 'Expiry date' },
    { key: 'issuing_authority', label: 'Issuing authority' },
    { key: 'issuing_jurisdiction', label: 'Issuing jurisdiction' },
    { key: 'issuing_country', label: 'Issuing country' },*/
  ];

  return (
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
      className="relative z-50"
    >
      <DialogBackdrop className="fixed inset-0 bg-black/40" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-2xl space-y-4 border border-gray-500 rounded-lg bg-white p-12 shadow-xl">
          <DialogTitle className="font-bold">Age Over 18</DialogTitle>
          <p className="-mt-2 text-gray-700">
            Select attributes of the attestation to be included in the request
          </p>
          <div className="flex flex-col gap-4">
            {fieldLabels.map(({ key, label }) => (
              <Field key={key} className="flex items-center gap-2">
                <Checkbox
                  checked={fields[key]}
                  onChange={() => toggleField(key)}
                  className="group block size-4 rounded border bg-white data-[checked]:bg-blue-500 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 data-[checked]:data-[disabled]:bg-gray-500"
                >
                  <CheckIcon className="text-white" />
                </Checkbox>
                <Label>{label}</Label>
              </Field>
            ))}
          </div>
          <div className="flex flex-row gap-4">
            <Button text="Select" onClick={() => updateQuery(fields)} />
            <Button text="Close" onClick={() => setIsOpen(false)} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
