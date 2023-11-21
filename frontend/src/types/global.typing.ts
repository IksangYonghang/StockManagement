export interface ICompany {
  id: string;
  companyName: string;
  companySize: string;
  createdAt: string;
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
}

export interface ICreateLedgerDto {
  LedgerCode: string;
  LedgerName: string;
  contact: string;
  address: string;
  MasterAccount: string;
  ParentId?: string;
}

export interface IUpdateLedgerDto {
  ledgerCode: string;
  ledgerName: string;
  contact: string;
  address: string;
  masterAccount: string;
  parentId?: string;
}

export interface ITransaction {
  id: string;
  date: string;
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
  middleName: string | null;
  lastName: string;
  address: string;
  phone: string;
  userType: string;
  email: string;
  userName: string | null;
  password: string;
}

export interface IResetPassword{
  userName: string;
  password: string;
}
