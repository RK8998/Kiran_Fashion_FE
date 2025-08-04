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
  remark: string;
};
