export enum ItemStatus {
  INCOMPLETE = '미완료',
  COMPLETED = '완료',
}

export interface SubMaterialItem {
  id: string;
  productCode: string;
  productName: string;
  salesYearMonth: string;
  salesQuantity: number;
  totalSalesPrice: number;
  subMaterialSalesPrice: number;
  subMaterialPurchasePrice: number;
  priceDifference: number;
  totalDifference: number;
  salesManager: string;
  closingManager: string;
  purchaseManager: string;
  customerCode: string;
  customerName: string;
  customerAbbr: string;
  status: ItemStatus;
  notes?: string;
  updatedAt: string;
}
