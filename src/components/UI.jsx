// src/components/UI.jsx
import React from 'react';

export const AppCard = ({ children, className = '' }) => (
  <div
    className={`rounded-xl border border-[var(--border-color)] bg-gray-900/60 backdrop-blur-md p-4 ${className}`}
  >
    {children}
  </div>
);

export const MetricCard = ({ title, value, delta, positive = true }) => (
  <AppCard className="flex flex-col items-center">
    <span className="text-sm text-gray-400">{title}</span>
    <span className="text-2xl font-medium">{value}</span>
    {delta !== undefined && (
      <span className={`text-sm ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
        ({positive ? '+' : '-'}
        {delta}%
      </span>
    )}
  </AppCard>
);

export const ChartCard = ({ children, title }) => (
  <AppCard className="flex flex-col">
    {title && <h3 className="mb-2 text-lg font-medium text-gray-200">{title}</h3>}
    {children}
  </AppCard>
);

export const SectionHeader = ({ title, actions }) => (
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-xl font-semibold text-gray-100">{title}</h2>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export const GradientButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500 ${className}`}
  >
    {children}
  </button>
);

export const SecondaryButton = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`rounded-md border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:bg-gray-800 ${className}`}
  >
    {children}
  </button>
);

export const StatusBadge = ({ children, variant = 'default' }) => {
  const colors = {
    default: 'bg-gray-800 text-gray-200',
    success: 'bg-emerald-700 text-emerald-100',
    warning: 'bg-amber-700 text-amber-100',
    danger: 'bg-rose-700 text-rose-100',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[variant]}`}
    >
      {children}
    </span>
  );
};

export const PredictionBadge = ({ direction = 'neutral', confidence = 0 }) => {
  const bg =
    direction === 'bull' ? 'bg-emerald-600' : direction === 'bear' ? 'bg-rose-600' : 'bg-gray-600';
  const label = direction === 'bull' ? 'Bullish' : direction === 'bear' ? 'Bearish' : 'Neutral';
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${bg} text-white`}>
      {' '}
      {label} ({confidence}%){' '}
    </span>
  );
};

export const DataTable = ({ columns, data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-700">
      <thead className="bg-gray-800">
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase"
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-gray-900 divide-y divide-gray-800">
        {data.map((row, i) => (
          <tr key={i} className={i % 2 ? '' : 'bg-gray-800/50'}>
            {columns.map((col) => (
              <td key={col.key} className="px-4 py-2 text-sm text-gray-200">
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const EmptyState = ({ title, description, action }) => (
  <AppCard className="flex flex-col items-center justify-center py-12 text-center">
    <h3 className="text-lg font-medium text-gray-200 mb-2">{title}</h3>
    <p className="text-gray-400 mb-4">{description}</p>
    {action && <div>{action}</div>}
  </AppCard>
);

export const LoadingSkeleton = ({ rows = 3, columns = 4 }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex space-x-2 animate-pulse">
        {Array.from({ length: columns }).map((_, c) => (
          <div key={c} className="h-4 w-1/4 bg-gray-800 rounded" />
        ))}
      </div>
    ))}
  </div>
);

export const SearchInput = ({ placeholder = 'Search...', value, onChange }) => (
  <div className="relative w-full max-w-sm">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-700 bg-gray-800 px-4 py-2 pl-10 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500"
    />
    <svg
      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
      />
    </svg>
  </div>
);

export const GlassPanel = ({ children, className = '' }) => (
  <div className={`glass-panel ${className}`}>{children}</div>
);

export {
  AppCard,
  MetricCard,
  ChartCard,
  SectionHeader,
  GradientButton,
  SecondaryButton,
  StatusBadge,
  PredictionBadge,
  DataTable,
  EmptyState,
  LoadingSkeleton,
  SearchInput,
  GlassPanel,
};
