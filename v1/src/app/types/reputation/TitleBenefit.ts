export interface TitleBenefit {
  type: 'trade_discount' | 'tax_reduction' | 'diplomatic_bonus' | 'access_rights' | 'income';
  value: number;
  description: string;
}
