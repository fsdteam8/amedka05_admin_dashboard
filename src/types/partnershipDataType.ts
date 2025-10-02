export interface PartnershipResponse {
  statusCode: number
  success: boolean
  message: string
  data: {
    meta: {
      page: number
      limit: number
      total: number
    }
    data: Partnership[]
  }
}

export interface Partnership {
  _id: string
  title: string
  description: string
  image: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface PartnershipData {
  title: string
  description: string
  image?: string
}


export interface Partnership {
  _id: string;
  title: string;
  description: string;
  image: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface SinglePartnershipResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Partnership;
}
