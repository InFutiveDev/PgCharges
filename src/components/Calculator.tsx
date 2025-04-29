import React, { useState, useEffect } from 'react';
import { Calculation, CalculationMode, PaymentMethodInfo } from '../types';
import { PAYMENT_METHODS, DEFAULT_INSTANT_SETTLEMENT_RATE } from '../constants/paymentMethods';
import { calculateCharges, calculateTotal } from '../utils/calculations';
import ToggleSwitch from './ToggleSwitch';
import PaymentMethodCard from './PaymentMethodCard';
import CalculationResults from './CalculationResults';
import { IndianRupee } from 'lucide-react';

const Calculator: React.FC = () => {
  const [amount, setAmount] = useState<string>('10000');
  const [mode, setMode] = useState<CalculationMode>('singleTransaction');
  const [useCustomRates, setUseCustomRates] = useState<boolean>(false);
  const [useInstantSettlement, setUseInstantSettlement] = useState<boolean>(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodInfo[]>(PAYMENT_METHODS);
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [customSettlementRate, setCustomSettlementRate] = useState<number>(DEFAULT_INSTANT_SETTLEMENT_RATE);

  // Parse amount
  const amountValue = parseFloat(amount) || 0;

  // Calculate total distribution
  const totalDistribution = paymentMethods.reduce(
    (sum, method) => sum + (method.selected && method.distribution ? method.distribution : 0),
    0
  );

  // Calculate charges whenever inputs change
  useEffect(() => {
    if (amountValue <= 0) {
      setCalculation(null);
      return;
    }

    const selectedMethods = paymentMethods.filter((method) => method.selected);

    if (selectedMethods.length === 0) {
      setCalculation(null);
      return;
    }

    const results = selectedMethods.map((method) => {
      const methodAmount = method.distribution
        ? amountValue * method.distribution
        : amountValue / selectedMethods.length;

      return calculateCharges(methodAmount, method, useInstantSettlement, customSettlementRate);
    });

    const totalSummary = calculateTotal(results);

    setCalculation({
      amount: amountValue,
      selectedMethods,
      useInstantSettlement,
      instantSettlementRate: customSettlementRate,
      results,
      totalSummary,
      mode,
    });
  }, [amountValue, paymentMethods, useInstantSettlement, mode, customSettlementRate]);

  // Handle payment method selection
  const handleMethodSelect = (id: string, selected: boolean) => {
    setPaymentMethods((prev) =>
      prev.map((method) =>
        method.id === id ? { ...method, selected, distribution: selected ? method.distribution : 0 } : method
      )
    );
  };

  // Handle custom rate change
  const handleCustomRateChange = (id: string, rate: number) => {
    setPaymentMethods((prev) =>
      prev.map((method) => (method.id === id ? { ...method, customRate: rate } : method))
    );
  };

  // Handle distribution change
  const handleDistributionChange = (id: string, distribution: number) => {
    setPaymentMethods((prev) =>
      prev.map((method) => (method.id === id ? { ...method, distribution } : method))
    );
  };

  // Handle settlement rate toggle
  const handleSettlementRateToggle = (isDefault: boolean) => {
    if (isDefault) {
      setCustomSettlementRate(DEFAULT_INSTANT_SETTLEMENT_RATE);
    } else {
      setCustomSettlementRate(0); // Reset to allow custom input
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-3 sm:p-5 border-b border-gray-200 bg-white">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Payment Gateway Charges Calculator</h2>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">
          Calculate transaction charges and settlement amounts for online payments
        </p>
      </div>

      <div className="p-3 sm:p-5 relative">
        <div className="absolute inset-0 bg-[url('https://ik.imagekit.io/InFutiveTechnology/kaivee/indian-rupee-symbol-frame-background_1017-36441.avif?updatedAt=1745486816417')] bg-no-repeat bg-center bg-contain opacity-20"></div>
        <div className="relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Left Column: Inputs */}
            <div className="space-y-4 sm:space-y-6">
              {/* Transaction Type Toggle */}
              <div className="bg-white p-3 sm:p-5 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm sm:text-md font-medium text-gray-800 mb-3 sm:mb-4">1. Select Transaction Type</h3>
                <div className="flex space-x-2 sm:space-x-4">
                  <button
                    className={`flex-1 py-2 px-3 sm:px-4 rounded-md transition-colors ${
                      mode === 'singleTransaction'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                    onClick={() => setMode('singleTransaction')}
                  >
                    Daily Volume
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 sm:px-4 rounded-md transition-colors ${
                      mode === 'monthlyVolume'
                        ? 'bg-[#0fb9810D] text-green-700 border border-green-200'
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                    onClick={() => setMode('monthlyVolume')}
                  >
                    Monthly Volume
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="bg-white p-3 sm:p-5 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm sm:text-md font-medium text-gray-800 mb-3 sm:mb-4">
                  2. Enter {mode === 'singleTransaction' ? 'Transaction Amount' : 'Monthly Volume'}
                </h3>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee size={16} className="text-gray-500" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                    placeholder="Enter amount in INR"
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white p-3 sm:p-5 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-sm sm:text-md font-medium text-gray-800">3. Select Payment Methods</h3>
                  <ToggleSwitch
                    id="custom-rates-toggle"
                    label="Custom Rates"
                    isChecked={useCustomRates}
                    onChange={setUseCustomRates}
                  />
                </div>

                {totalDistribution > 1 && (
                  <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-xs sm:text-sm text-red-600">
                      Total distribution ({(totalDistribution * 100).toFixed(0)}%) exceeds 100%. Please adjust the
                      distribution percentages.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-2">
                  {paymentMethods.map((method) => (
                    <PaymentMethodCard
                      key={method.id}
                      method={method}
                      useCustomRates={useCustomRates}
                      onSelect={handleMethodSelect}
                      onCustomRateChange={handleCustomRateChange}
                      onDistributionChange={handleDistributionChange}
                      totalDistribution={totalDistribution}
                    />
                  ))}
                </div>
              </div>

              {/* Instant Settlement Toggle */}
              <div className="bg-white p-3 sm:p-5 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-sm sm:text-md font-medium text-gray-800 mb-3 sm:mb-4">4. Settlement Options</h3>
                <ToggleSwitch
                  id="instant-settlement-toggle"
                  label="Instant Settlement"
                  isChecked={useInstantSettlement}
                  onChange={setUseInstantSettlement}
                  description="Enable to add 0.25% extra charge or add custom charge for instant settlement"
                />

                {/* Settlement Rate Options */}
                {useInstantSettlement && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Settlement Rate Type</label>
                    <div className="flex items-center space-x-4">
                      <button
                        className={`py-2 px-4 rounded-md text-sm ${
                          customSettlementRate === DEFAULT_INSTANT_SETTLEMENT_RATE
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                        onClick={() => handleSettlementRateToggle(true)}
                      >
                        Default Rate
                      </button>
                      <button
                        className={`py-2 px-4 rounded-md text-sm ${
                          customSettlementRate !== DEFAULT_INSTANT_SETTLEMENT_RATE
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}
                        onClick={() => handleSettlementRateToggle(false)}
                      >
                        Custom Rate
                      </button>
                    </div>

                    {/* Custom Settlement Rate Input */}
                    {customSettlementRate !== DEFAULT_INSTANT_SETTLEMENT_RATE && (
                      <div className="mt-4">
                        <label htmlFor="custom-settlement-rate" className="block text-sm font-medium text-gray-700">
                          Custom Settlement Rate (%)
                        </label>
                        <input
                          type="number"
                          id="custom-settlement-rate"
                          min="0"
                          max="100"
                          step="0.01"
                          value={customSettlementRate}
                          onChange={(e) => setCustomSettlementRate(parseFloat(e.target.value) || 0)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Enter custom settlement rate"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Results */}
            <div>
              {calculation ? (
                <CalculationResults
                  results={calculation.results}
                  totalSummary={calculation.totalSummary}
                  mode={calculation.mode}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-md border border-gray-100 p-3 sm:p-5 text-center h-full flex flex-col justify-center items-center">
                  <div className="text-gray-400 mb-2 sm:mb-3">
                    <IndianRupee size={40} />
                  </div>
                  <h3 className="text-md sm:text-lg font-medium text-gray-700 mb-1 sm:mb-2">
                    No calculation results yet
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    Enter an amount and select at least one payment method to see the calculation
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;