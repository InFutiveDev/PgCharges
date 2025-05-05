import React, { useState, useEffect } from 'react';
import { PaymentMethodInfo } from '../types';
import { formatPercentage } from '../utils/calculations';

interface PaymentMethodCardProps {
  method: PaymentMethodInfo;
  useCustomRates: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onCustomRateChange: (id: string, rate: number) => void;
  onDistributionChange: (id: string, distribution: number) => void;
  totalDistribution: number;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  method,
  useCustomRates,
  onSelect,
  onCustomRateChange,
  onDistributionChange,
  totalDistribution,
}) => {
  const [customRate, setCustomRate] = useState<string>(
    method.customRate ? String(method.customRate * 100) : String(method.defaultRate * 100)
  );
  const [distribution, setDistribution] = useState<string>(
    method.distribution ? String(method.distribution * 100) : '0'
  );

  // Sync local state with updated props
  useEffect(() => {
    setCustomRate(method.customRate ? String(method.customRate * 100) : String(method.defaultRate * 100));
    setDistribution(method.distribution ? String(method.distribution * 100) : '0');
  }, [method]);

  const handleCustomRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomRate(value);

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onCustomRateChange(method.id, numValue / 100);
    }
  };

  const handleDistributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseFloat(value);

    if (!isNaN(numValue)) {
      const newDistribution = Math.min(numValue / 100, 1);
      setDistribution(String(newDistribution * 100));
      onDistributionChange(method.id, newDistribution);
    } else {
      setDistribution('0');
      onDistributionChange(method.id, 0);
    }
  };

  const remainingDistribution = Math.max(0, 100 - ((totalDistribution - (method.distribution || 0)) * 100));

  return (
    <div
      className={`
        border rounded-lg p-4 transition-all duration-200
        ${method.selected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'}
        hover:shadow-md cursor-pointer
      `}
      onClick={() => onSelect(method.id, !method.selected)}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={method.selected || false}
            onChange={() => onSelect(method.id, !method.selected)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            onClick={(e) => e.stopPropagation()}
          />
          <label className="ml-2 text-gray-800 font-medium">{method.name}</label>
        </div>
        <span className="text-sm font-medium text-gray-500">
          Default: {formatPercentage(method.defaultRate)}
        </span>
      </div>

      {method.selected && (
        <div className="mt-3 pl-6 space-y-3">
          {useCustomRates && (
            <div>
              <label htmlFor={`rate-${method.id}`} className="block text-xs text-gray-500 mb-1">
                Custom Rate (%)
              </label>
              <input
                id={`rate-${method.id}`}
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={customRate}
                onChange={handleCustomRateChange}
                onClick={(e) => e.stopPropagation()}
                className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          <div>
            <label htmlFor={`distribution-${method.id}`} className="block text-xs text-gray-500 mb-1">
              Volume Distribution (%)
            </label>
            <input
              id={`distribution-${method.id}`}
              type="number"
              min="0"
              max={remainingDistribution}
              step="1"
              value={distribution}
              onChange={handleDistributionChange}
              onClick={(e) => e.stopPropagation()}
              className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            {totalDistribution > 1 && (
              <p className="text-xs text-red-500 mt-1">Total distribution exceeds 100%</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodCard;