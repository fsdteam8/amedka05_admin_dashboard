export interface Contact {
  _id: string;
  fullName: string;
  selectOption: "agent" | "creator"; // if only these two are possible
  phoneNumber: string;
  email: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ContactMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ContactData {
  meta: ContactMeta;
  data: Contact[];
}

export interface ContactResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ContactData;
}
