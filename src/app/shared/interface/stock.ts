export interface Stock {
  vwdKey: string;
  name: string;
  isin?: string;
  price: number;
  time?: string;
  open: number;
  high?: number;
  low?: number;
  close?: number;
  volume: number;
  previousClose?: number;
  previousCloseTime?: string;
  quantity: number;
  currentValue?: number;
}
