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
import { CheckIcon } from '@heroicons/react/16/solid';
import { useEffect, useState } from 'react';
import { AGE_THRESHOLDS, AgeField, Fields } from '../lib/types';
import Button from './ui/button';

const FIELD_LABELS: { key: AgeField; label: string }[] = AGE_THRESHOLDS.map(
  (threshold) => ({
    key: `age_over_${threshold}` as AgeField,
    label: `Age over ${threshold}`,
  })
);

const DEFAULT_FIELDS: Fields = FIELD_LABELS.reduce(
  (acc, { key }) => ({ ...acc, [key]: key === 'age_over_18' }),
  {} as Fields
);

interface ConfigureDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  updateQuery: (fields: Fields) => void;
}

export default function ConfigureDialog({
  isOpen,
  setIsOpen,
  updateQuery,
}: ConfigureDialogProps) {
  const [fields, setFields] = useState<Fields>(DEFAULT_FIELDS);
  const [tempFields, setTempFields] = useState<Fields>(fields);

  useEffect(() => {
    if (isOpen) {
      setTempFields(fields);
    }
  }, [isOpen, fields]);

  const toggleField = (field: AgeField) => {
    setTempFields((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleApply = () => {
    setFields(tempFields);
    updateQuery(tempFields);
    setIsOpen(false);
  };

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
            {FIELD_LABELS.map(({ key, label }) => (
              <Field key={key} className="flex items-center gap-2">
                <Checkbox
                  checked={tempFields[key]}
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
            <Button text="Apply" onClick={handleApply} />
            <Button text="Cancel" onClick={() => setIsOpen(false)} />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
