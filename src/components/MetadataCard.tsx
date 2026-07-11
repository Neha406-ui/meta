import React from 'react';

interface MetadataItem {
  label: string;
  value: React.ReactNode | undefined | null | string | number;
}

interface MetadataCardProps {
  title: string;
  icon?: React.ReactNode;
  color?: 'indigo' | 'blue' | 'purple' | 'green' | 'red' | 'gray';
  items: MetadataItem[];
}

const colorClasses = {
  indigo: 'text-indigo-600 bg-indigo-50',
  blue: 'text-blue-600 bg-blue-50',
  purple: 'text-purple-600 bg-purple-50',
  green: 'text-green-600 bg-green-50',
  red: 'text-red-600 bg-red-50',
  gray: 'text-gray-600 bg-gray-50',
};

export default function MetadataCard({ title, icon, color = 'gray', items }: MetadataCardProps) {
  const colorClass = colorClasses[color];

  const validItems = items.filter(item => item.value !== undefined && item.value !== null && item.value !== '');

  if (validItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3 px-5 py-4 border-b border-gray-50">
        {icon && (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
            {icon}
          </div>
        )}
        <h3 className="font-semibold text-gray-900 text-sm tracking-tight">{title}</h3>
      </div>
      <dl className="divide-y divide-gray-50 px-5">
        {validItems.map((item, i) => (
          <div key={i} className="flex items-start justify-between py-3 gap-4">
            <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap pt-0.5">
              {item.label}
            </dt>
            <dd className="text-sm text-gray-700 font-medium text-right break-all leading-relaxed">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
