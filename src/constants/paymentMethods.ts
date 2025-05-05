import { PaymentMethodInfo } from '../types';

export const GST_RATE = 0.18; // 18% GST
export const DEFAULT_INSTANT_SETTLEMENT_RATE = 0.0025; // 0.25%

export const PAYMENT_METHODS: PaymentMethodInfo[] = [
  {
    id: 'upi',
    name: 'UPI',
    defaultRate: 0.005, // 0.50%
    selected: true,
  },
  {
    id: 'creditCard',
    name: 'Credit Card',
    defaultRate: 0.02, // 2.00%
    selected: false,
  },
  {
    id: 'debitCard',
    name: 'Debit Card',
    defaultRate: 0.01, // 1.00%
    selected: false,
  },
  {
    id: 'netBanking',
    name: 'Net Banking',
    defaultRate: 0.015, // 1.50%
    selected: false,
  },
  {
    id: 'wallets',
    name: 'Wallets',
    defaultRate: 0.0175, // 1.75%
    selected: false,
  },
  {
    id: 'corporateCard',
    name: 'Corporate Credit Card',
    defaultRate: 0.0275, // 2.75%
    selected: false,
  },
  {
    id: 'prepaidCard',
    name: 'Prepaid Credit Card',
    defaultRate: 0.025, // 2.50%
    selected: false,
  },
];