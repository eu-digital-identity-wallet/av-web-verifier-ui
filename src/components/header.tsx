// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

export default function Header({
  openConfigureDialog,
  setOpenCofigureDialog,
  openTransactionLogsDialog,
  setOpenTransactionLogsDialog,
}: {
  openConfigureDialog: boolean;
  setOpenCofigureDialog: (open: boolean) => void;
  openTransactionLogsDialog: boolean;
  setOpenTransactionLogsDialog: (open: boolean) => void;
}) {
  return (
    <div className="p-4 shadow-lg rounded-lg flex justify-between items-center">
      <div className="flex items-center gap-4">
        <img src="/ic-logo.svg" />
        <h1 className="text-2xl font-bold">
          EU Age Verification Solution Demo
        </h1>
      </div>
      <Menu>
        <MenuButton>
          <div aria-label="Open menu" className="cursor-pointer">
            <span className="block w-8 h-0.5 bg-gray-700 rounded transition-all"></span>
            <span className="block w-8 h-0.5 bg-gray-700 rounded my-1 transition-all"></span>
            <span className="block w-8 h-0.5 bg-gray-700 rounded transition-all"></span>
          </div>
        </MenuButton>
        <MenuItems
          anchor="bottom"
          className="mt-2 w-56 bg-white shadow-lg rounded-lg ring-1 ring-black/5 focus:outline-none"
        >
          <MenuItem>
            <a
              className="block px-4 py-2 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => setOpenCofigureDialog(!openConfigureDialog)}
            >
              Configure Claims
            </a>
          </MenuItem>
          <MenuItem>
            <a
              className="block px-4 py-2 rounded cursor-pointer hover:bg-gray-100"
              onClick={() =>
                setOpenTransactionLogsDialog(!openTransactionLogsDialog)
              }
            >
              Inspect Transaction Logs
            </a>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}
