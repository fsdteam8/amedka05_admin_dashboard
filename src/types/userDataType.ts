export interface ProfileResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ProfileData;
}

export interface ProfileData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "admin" | "user" | "landlord" | "other"; // adjust roles as needed
  profileImage: string;
  verified: boolean;
  phoneNumber: string;
  jobTitle: string;
  location: string;
  bio?: string; // optional
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}
