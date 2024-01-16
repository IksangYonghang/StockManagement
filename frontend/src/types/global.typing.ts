export interface ICompany {
  id: string;
  companyName: string;
  companySize: string;
  createdAt: string;
  userName: string | null;
  userId: string;
  user: IUser;
}

export interface ICreateCompanyDto {
  companyName: string;
  companySize: string;
}

export interface IUpdateCompanyDto {
  companyName: string;
  companySize: string;
}

export interface ICategory {
  id: string;
  categoryName: string;
  description: string;
  createdAt: string;
}

export interface ICreateCategoryDto {
  categoryName: string;
  description: string;
}

export interface IUpdateCategoryDto {
  categoryName: string;
  description: string;
}

export interface IProduct {
  id: string;
  productName: string;
  productDescription: string;
  productSize: string;
  markedPrice: string;
  costPrice: string;
  wholeSalePrice: string;
  retailPrice: string;
  imageUrl: string;
  categoryId: string;
  categoryName: string;
  companyId: string;
  companyName: string;
}
export interface ICreateProductDto {
  productName: string;
  productDescription: string;
  productSize: string;
  markedPrice: string;
  costPrice: string;
  wholeSalePrice: string;
  retailPrice: string;
  categoryId: string;
  categoryName: string;
  companyId: string;
  companyName: string;
}

export interface IUpdateProductDto {
  productName: string;
  productDescription: string;
  productSize: string;
  markedPrice: string;
  costPrice: string;
  wholeSalePrice: string;
  retailPrice: string;
  categoryId: string;
  categoryName: string;
  companyId: string;
  companyName: string;
}

export interface ILedger {
  id: string;
  ledgerCode: string;
  ledgerName: string;
  contact: string;
  address: string;
  masterAccount: string;
  parentId?: string;
  parentAccount?: string;
  createdAt: string;
  isTranGl: boolean;
}

export interface ICreateLedgerDto {
  LedgerCode: string;
  LedgerName: string;
  contact: null | string;
  address: null | string;
  MasterAccount: string;
  ParentId?: string;
  isTranGl: boolean;
}

export interface IUpdateLedgerDto {
  ledgerCode: string;
  ledgerName: string;
  contact: null | string;
  address: null | string;
  masterAccount: string;
  parentId?: string;
  isTranGl: boolean;
}

export interface ITransaction {
  id: string;
  date: string;
  transactionId: string;
  invoiceNumber: string;
  ledgerId: string;
  ledgerName: string;
  productId: string;
  product: IProduct;
  productName: string;
  piece: string;
  transactionType: string;
  transactionMethod: string;
  debit: string;
  credit: string;
  narration: string;
}

export interface ITransactionCreateDto {
  userId: number;
  date: string;
  invoiceNumber: string;
  ledgerId: string;
  productId: string;
  piece: string;
  transactionType: string;
  transactionMethod: string;
  debit: string;
  credit: string;
  narration: string;
}

export interface ITransactionUpdateDto {
  id?: string;
  transactionId?: string;
  date: string;
  invoiceNumber: string;
  ledgerId?: string | null;
  productId?: string | null;
  piece: string | null;
  transactionType: string;
  transactionMethod: string;
  debit?: string | null;
  credit?: string | null;
  narration: string | null;
  ledgerName: string | null;
  productName: string | null;
}

export interface ILogin {
  userName: string;
  password: string;
}

export interface IUser {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  address: string;
  phone: string;
  userType: string;
  email: string;
  userName: string | null;
  passwordHash: string;
}

export interface ICreateUserDto {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  address: string;
  phone: string;
  userType: string;
  email: string;
  userName: string;
  password: string;
}

export interface IResetPassword {
  userName: string;
  password: string;
}

export interface IUpdateUserDto {
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  address: string;
  phone: string;
  userType: string;
  email: string;
  userName: string;
  password: string;
}

export interface IPaymentReceipt {
  id: string;
  date: string;
  transactionId: string;
  invoiceNumber: string;
  ledgerId: string;
  ledgerName: string;
  transactionType: string;
  transactionMethod: string;
  debit: string;
  credit: string;
  narration: string;
}

export interface IPaymentReceiptCreateDto {
  userId: number;
  date: string;
  invoiceNumber: string;
  ledgerId: string;
  piece: string | null | undefined;
  productId: string | null | undefined;
  transactionType: string;
  transactionMethod: string;
  debit: string;
  credit: string;
  narration: string;
}

export interface IDashProductList {
  productName: string;
  productSize: string;
  markedPrice: string;
  costPrice: string;
  wholeSalePrice: string;
  retailPrice: string;
  categoryId: string;
  categoryName: string;
  imageUrl: string;
}
