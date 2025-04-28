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

  // Parse amount
  const amountValue = parseFloat(amount) || 0;

  // Calculate total distribution
  const totalDistribution = paymentMethods.reduce((sum, method) => 
    sum + (method.selected && method.distribution ? method.distribution : 0), 0
  );

  // Calculate charges whenever inputs change
  useEffect(() => {
    if (amountValue <= 0) {
      setCalculation(null);
      return;
    }

    const selectedMethods = paymentMethods.filter(method => method.selected);
    
    if (selectedMethods.length === 0) {
      setCalculation(null);
      return;
    }

    const results = selectedMethods.map(method => {
      const methodAmount = method.distribution 
        ? amountValue * method.distribution 
        : amountValue / selectedMethods.length;

      return calculateCharges(
        methodAmount,
        method,
        useInstantSettlement,
        DEFAULT_INSTANT_SETTLEMENT_RATE
      );
    });

    const totalSummary = calculateTotal(results);

    setCalculation({
      amount: amountValue,
      selectedMethods,
      useInstantSettlement,
      instantSettlementRate: DEFAULT_INSTANT_SETTLEMENT_RATE,
      results,
      totalSummary,
      mode
    });
  }, [amountValue, paymentMethods, useInstantSettlement, mode]);

  // Handle payment method selection
  const handleMethodSelect = (id: string, selected: boolean) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === id 
          ? { ...method, selected, distribution: selected ? method.distribution : 0 } 
          : method
      )
    );
  };

  // Handle custom rate change
  const handleCustomRateChange = (id: string, rate: number) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === id 
          ? { ...method, customRate: rate } 
          : method
      )
    );
  };

  // Handle distribution change
  const handleDistributionChange = (id: string, distribution: number) => {
    setPaymentMethods(prev => 
      prev.map(method => 
        method.id === id 
          ? { ...method, distribution } 
          : method
      )
    );
  };

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200 bg-white">
        <h2 className="text-xl font-semibold text-gray-800">Payment Gateway Charges Calculator</h2>
        <p className="text-gray-500 text-sm mt-1">Calculate transaction charges and settlement amounts for online payments</p>
      </div>

      <div className="p-5 relative">
        <div className="absolute inset-0 bg-[url('https://ik.imagekit.io/InFutiveTechnology/kaivee/indian-rupee-symbol-frame-background_1017-36441.avif?updatedAt=1745486816417')] bg-no-repeat bg-center bg-contain opacity-20"></div>
        <div className="relative z-10">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Column: Inputs */}
            <div className="space-y-6">
              {/* Transaction Type Toggle */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-md font-medium text-gray-800 mb-4">1. Select Transaction Type</h3>
                <div className="flex space-x-4">
                  <button
                    className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                      mode === 'singleTransaction' 
                        ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200'
                    }`}
                    onClick={() => setMode('singleTransaction')}
                  >
                    Single Transaction
                  </button>
                  <button
                    className={`flex-1 py-2 px-4 rounded-md transition-colors ${
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
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-md font-medium text-gray-800 mb-4">
                  2. Enter {mode === 'singleTransaction' ? 'Transaction Amount' : 'Monthly Volume'}
                </h3>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <IndianRupee size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="number"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount in INR"
                  />
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-md font-medium text-gray-800">3. Select Payment Methods</h3>
                  
                  <ToggleSwitch
                    id="custom-rates-toggle"
                    label="Custom Rates"
                    isChecked={useCustomRates}
                    onChange={setUseCustomRates}
                  />
                </div>
                
                {totalDistribution > 1 && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">
                      Total distribution ({(totalDistribution * 100).toFixed(0)}%) exceeds 100%. Please adjust the distribution percentages.
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
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
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <h3 className="text-md font-medium text-gray-800 mb-4">4. Settlement Options</h3>
                <ToggleSwitch
                  id="instant-settlement-toggle"
                  label="Instant Settlement"
                  isChecked={useInstantSettlement}
                  onChange={setUseInstantSettlement}
                  description="Enable to add 0.25% extra charge for instant settlement"
                />
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
                <div className="bg-white rounded-lg shadow-md border border-gray-100 p-5 text-center h-full flex flex-col justify-center items-center">
                  <div className="text-gray-400 mb-3">
                    <IndianRupee size={48} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No calculation results yet</h3>
                  <p className="text-gray-500 text-sm">
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