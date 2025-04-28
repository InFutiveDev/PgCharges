import React from 'react';
import { CalculationSummary } from '../types';
import { formatCurrency, formatPercentage } from '../utils/calculations';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer } from 'recharts';

interface CalculationResultsProps {
  results: CalculationSummary[];
  totalSummary: Omit<CalculationSummary, 'paymentMethod'>;
  mode: 'singleTransaction' | 'monthlyVolume';
}

const CalculationResults: React.FC<CalculationResultsProps> = ({ 
  results, 
  totalSummary, 
  mode 
}) => {
  if (results.length === 0) {
    return null;
  }

  const chartData = [
    { name: 'PG Charges', value: totalSummary.pgCharges },
    { name: 'GST on PG', value: totalSummary.gstOnCharges },
    { name: 'Instant Settlement', value: totalSummary.instantSettlementFee },
    { name: 'GST on Settlement', value: totalSummary.gstOnInstantSettlement },
  ].filter(item => item.value > 0);

  const chartColors = ['#3B82F6', '#10B981', '#F97316', '#8B5CF6'];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      <div className="p-5 border-b border-gray-100">
        <h3 className={`text-lg font-semibold ${
          mode === 'singleTransaction' ? 'text-blue-600' : 'text-green-600'
        }`}>
          {mode === 'singleTransaction' ? 'Transaction Summary' : 'Monthly Volume Summary'}
        </h3>
      </div>

      {/* Chart Visualization */}
      <div className="p-5 bg-gray-50">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} width={90}/>
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip 
                formatter={(value: number) => [formatCurrency(value), 'Amount']}
                contentStyle={{ borderRadius: '8px' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Total Summary */}
      <div className="p-5 bg-white border-t border-gray-100">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Amount:</span>
            <span className="font-semibold">{formatCurrency(totalSummary.amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">PG Charges:</span>
            <span className="text-red-600">{formatCurrency(totalSummary.pgCharges)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">GST on PG Charges (18%):</span>
            <span className="text-red-600">{formatCurrency(totalSummary.gstOnCharges)}</span>
          </div>
          {totalSummary.instantSettlementFee > 0 && (
            <>
              <div className="flex justify-between">
                <span className="text-gray-600">Instant Settlement Fee:</span>
                <span className="text-red-600">{formatCurrency(totalSummary.instantSettlementFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">GST on Settlement Fee:</span>
                <span className="text-red-600">{formatCurrency(totalSummary.gstOnInstantSettlement)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <span className="text-gray-600">Total Deductions:</span>
            <span className="text-red-600 font-semibold">{formatCurrency(totalSummary.totalDeductions)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <span className="text-gray-700 font-medium">Final Settlement:</span>
            <span className="text-green-600 font-bold text-xl animate-[scale_2s_ease-in-out_infinite]">
              {formatCurrency(totalSummary.finalSettlement)}
            </span>
          </div>
        </div>
      </div>
      
      {/* Per Payment Method Breakdown */}
      {results.length > 1 && (
        <div className="p-5 border-t border-gray-100">
          <h4 className="text-md font-medium text-gray-700 mb-4">Breakdown by Payment Method</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distribution
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PG Charges
                  </th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GST
                  </th>
                  {totalSummary.instantSettlementFee > 0 && (
                    <>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Settlement Fee
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        GST on Fee
                      </th>
                    </>
                  )}
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Final Settlement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                      {result.paymentMethod.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-right">
                      {formatPercentage(result.paymentMethod.distribution || 0)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                      {formatCurrency(result.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 text-right">
                      {formatPercentage(result.paymentMethod.customRate !== undefined 
                        ? result.paymentMethod.customRate 
                        : result.paymentMethod.defaultRate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-600 text-right">
                      {formatCurrency(result.pgCharges)}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-600 text-right">
                      {formatCurrency(result.gstOnCharges)}
                    </td>
                    {totalSummary.instantSettlementFee > 0 && (
                      <>
                        <td className="px-4 py-3 text-sm text-red-600 text-right">
                          {formatCurrency(result.instantSettlementFee)}
                        </td>
                        <td className="px-4 py-3 text-sm text-red-600 text-right">
                          {formatCurrency(result.gstOnInstantSettlement)}
                        </td>
                      </>
                    )}
                    <td className="px-4 py-3 text-sm text-green-600 font-medium text-right">
                      {formatCurrency(result.finalSettlement)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">Total</td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-right">100%</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                    {formatCurrency(totalSummary.amount)}
                  </td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-sm text-red-600 font-medium text-right">
                    {formatCurrency(totalSummary.pgCharges)}
                  </td>
                  <td className="px-4 py-3 text-sm text-red-600 font-medium text-right">
                    {formatCurrency(totalSummary.gstOnCharges)}
                  </td>
                  {totalSummary.instantSettlementFee > 0 && (
                    <>
                      <td className="px-4 py-3 text-sm text-red-600 font-medium text-right">
                        {formatCurrency(totalSummary.instantSettlementFee)}
                      </td>
                      <td className="px-4 py-3 text-sm text-red-600 font-medium text-right">
                        {formatCurrency(totalSummary.gstOnInstantSettlement)}
                      </td>
                    </>
                  )}
                  <td className="px-4 py-3 text-sm text-green-600 font-bold text-right">
                    {formatCurrency(totalSummary.finalSettlement)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculationResults;