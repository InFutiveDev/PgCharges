export type PaymentMethod = 
  | 'upi'
  | 'creditCard'
  | 'debitCard'
  | 'netBanking'
  | 'wallets'
  | 'corporateCard'
  | 'prepaidCard';

export type PaymentMethodInfo = {
  id: PaymentMethod;
  name: string;
  defaultRate: number;
  selected?: boolean;
  customRate?: number;
  distribution?: number;
};

export type CalculationMode = 'singleTransaction' | 'monthlyVolume';

export type CalculationSummary = {
  paymentMethod: PaymentMethodInfo;
  amount: number;
  pgCharges: number;
  gstOnCharges: number;
  instantSettlementFee: number;
  gstOnInstantSettlement: number;
  totalDeductions: number;
  finalSettlement: number;
};

export type Calculation = {
  amount: number;
  selectedMethods: PaymentMethodInfo[];
  useInstantSettlement: boolean;
  instantSettlementRate: number;
  results: CalculationSummary[];
  totalSummary: Omit<CalculationSummary, 'paymentMethod'>;
  mode: CalculationMode;
};