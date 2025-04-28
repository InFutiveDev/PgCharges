import { 
  Calculation, 
  CalculationSummary, 
  PaymentMethodInfo 
} from '../types';
import { GST_RATE, DEFAULT_INSTANT_SETTLEMENT_RATE } from '../constants/paymentMethods';

export const calculateCharges = (
  amount: number,
  paymentMethod: PaymentMethodInfo,
  useInstantSettlement: boolean,
  instantSettlementRate: number = DEFAULT_INSTANT_SETTLEMENT_RATE
): CalculationSummary => {
  // Get the rate to apply (custom rate if available, otherwise default)
  const rateToApply = paymentMethod.customRate !== undefined 
    ? paymentMethod.customRate 
    : paymentMethod.defaultRate;

  // Calculate PG charges
  const pgCharges = amount * rateToApply;
  
  // Calculate GST on PG charges
  const gstOnCharges = pgCharges * GST_RATE;
  
  // Calculate instant settlement fee and its GST if applicable
  const instantSettlementFee = useInstantSettlement ? amount * instantSettlementRate : 0;
  const gstOnInstantSettlement = useInstantSettlement ? instantSettlementFee * GST_RATE : 0;
  
  // Calculate total deductions
  const totalDeductions = pgCharges + gstOnCharges + instantSettlementFee + gstOnInstantSettlement;
  
  // Calculate final settlement amount
  const finalSettlement = amount - totalDeductions;
  
  return {
    paymentMethod,
    amount,
    pgCharges,
    gstOnCharges,
    instantSettlementFee,
    gstOnInstantSettlement,
    totalDeductions,
    finalSettlement
  };
};

export const calculateTotal = (
  results: CalculationSummary[]
): Omit<CalculationSummary, 'paymentMethod'> => {
  if (results.length === 0) {
    return {
      amount: 0,
      pgCharges: 0,
      gstOnCharges: 0,
      instantSettlementFee: 0,
      gstOnInstantSettlement: 0,
      totalDeductions: 0,
      finalSettlement: 0
    };
  }

  // Sum up all values
  const amount = results.reduce((sum, item) => sum + item.amount, 0);
  const pgCharges = results.reduce((sum, item) => sum + item.pgCharges, 0);
  const gstOnCharges = results.reduce((sum, item) => sum + item.gstOnCharges, 0);
  const instantSettlementFee = results.reduce((sum, item) => sum + item.instantSettlementFee, 0);
  const gstOnInstantSettlement = results.reduce((sum, item) => sum + item.gstOnInstantSettlement, 0);
  const totalDeductions = results.reduce((sum, item) => sum + item.totalDeductions, 0);
  const finalSettlement = results.reduce((sum, item) => sum + item.finalSettlement, 0);

  return {
    amount,
    pgCharges,
    gstOnCharges,
    instantSettlementFee,
    gstOnInstantSettlement,
    totalDeductions,
    finalSettlement
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

export const distributeAmount = (amount: number, selectedMethods: PaymentMethodInfo[]): PaymentMethodInfo[] => {
  const methodsWithoutDistribution = selectedMethods.filter(m => !m.distribution);
  const totalExplicitDistribution = selectedMethods.reduce(
    (sum, m) => sum + (m.distribution || 0), 
    0
  );
  
  const remainingDistribution = Math.max(0, 1 - totalExplicitDistribution);
  const defaultDistribution = methodsWithoutDistribution.length > 0 
    ? remainingDistribution / methodsWithoutDistribution.length 
    : 0;

  return selectedMethods.map(method => ({
    ...method,
    distribution: method.distribution || defaultDistribution
  }));
};