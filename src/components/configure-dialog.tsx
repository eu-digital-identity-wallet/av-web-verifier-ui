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
    age_over_13: false,
    age_over_15: false,
    age_over_16: false,
    age_over_21: false,
    age_over_23: false,
    age_over_25: false,
    age_over_27: false,
    age_over_28: false,
    age_over_40: false,
    age_over_60: false,
    age_over_65: false,
    age_over_67: false,
    /* issue_date: false,
    expiry_date: false,
    issuing_authority: false,
    issuing_jurisdiction: false,
    issuing_country: false,*/
  });

  const toggleField = (field: keyof typeof fields) => {
    setFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const fieldLabels: { key: keyof Fields; label: string }[] = [
    { key: 'age_over_18', label: 'Age over 18' },
    { key: 'age_over_13', label: 'Age over 13' },
    { key: 'age_over_15', label: 'Age over 15' },
    { key: 'age_over_16', label: 'Age over 16' },
    { key: 'age_over_21', label: 'Age over 21' },
    { key: 'age_over_23', label: 'Age over 23' },
    { key: 'age_over_25', label: 'Age over 25' },
    { key: 'age_over_27', label: 'Age over 27' },
    { key: 'age_over_28', label: 'Age over 28' },
    { key: 'age_over_40', label: 'Age over 40' },
    { key: 'age_over_60', label: 'Age over 60' },
    { key: 'age_over_65', label: 'Age over 65' },
    { key: 'age_over_67', label: 'Age over 67' },
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
