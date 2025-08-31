export type LoginFormTypes = {
  email: string;
  password: string;
};

export type NotesFormTypes = {
  title: string;
  description: string;
};

export type UserFormTypes = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  [key: string]: any; // Allow additional properties
};

export type ProductFormTypes = {
  name: string;
  base_amount: number;
  sell_amount: number;
  remark: string;
};

export type SalesFormTypes = {
  product_id: any; // Assuming product_id can be a number or string
  base_amount: number; // Assuming base_amount is a string for currency input
  sell_amount: number;
  discount: number;
  remark: string;
};

export type ChangePasswordFormTypes = {
  new_password?: string;
  confirm_password?: string;
};

export type ApiChangePasswordFormTypes = {
  password?: string;
  user_id?: string;
};
