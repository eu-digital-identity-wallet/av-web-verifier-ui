// SPDX-FileCopyrightText: 2025 European Commission
//
// SPDX-License-Identifier: Apache-2.0

import { useState } from 'react';
import { TransactionLog } from '../lib/types';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import clsx from 'clsx';

interface TransactionLogsProps {
  logs: TransactionLog[];
}

export default function TransactionLogs({ logs }: TransactionLogsProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const formatData = (data: unknown): string => {
    if (typeof data === 'string') {
      return data;
    }
    return JSON.stringify(data, null, 2);
  };

  const formatTimestamp = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ms = date.getMilliseconds().toString().padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'initialized':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'polling':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'initialized':
        return 'Initialized';
      case 'polling':
        return 'Polling';
      default:
        return type;
    }
  };

  if (logs.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No transaction logs yet. Start a verification to see logs here.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {logs.map((log) => {
        const isExpanded = expandedIds.has(log.id);
        return (
          <div
            key={log.id}
            className="border border-gray-300 rounded-md bg-white"
          >
            <button
              onClick={() => toggleExpanded(log.id)}
              className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="flex-shrink-0 mt-0.5">
                {isExpanded ? (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-mono text-gray-600">
                    {formatTimestamp(log.timestamp)}
                  </span>
                  <span
                    className={clsx(
                      'px-2 py-0.5 text-xs font-semibold rounded border',
                      getTypeBadgeColor(log.type)
                    )}
                  >
                    {getTypeLabel(log.type)}
                  </span>
                  {log.transactionId && (
                    <span className="text-xs text-gray-500 font-mono truncate">
                      ID: {log.transactionId.substring(0, 8)}...
                    </span>
                  )}
                </div>
                {log.error && (
                  <div className="mt-1 text-sm text-red-600">{log.error}</div>
                )}
              </div>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-200 bg-gray-50">
                {!!log.request && (
                  <div className="mb-3">
                    <div className="text-xs font-semibold text-gray-700 mb-1">
                      Request:
                    </div>
                    <pre className="text-xs bg-white border border-gray-300 rounded p-2 overflow-x-auto">
                      {formatData(log.request)}
                    </pre>
                  </div>
                )}
                {!!log.response && (
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-1">
                      Response:
                    </div>
                    <pre className="text-xs bg-white border border-gray-300 rounded p-2 overflow-x-auto">
                      {formatData(log.response)}
                    </pre>
                  </div>
                )}
                {log.error && (
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-1">
                      Error Details:
                    </div>
                    <pre className="text-xs bg-white border border-gray-300 rounded p-2 overflow-x-auto">
                      {log.error}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
