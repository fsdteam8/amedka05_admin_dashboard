import { ProfileResponse } from "@/types/userDataType"

export async function uploadAvatar(file: File, token: string) {
  const formData = new FormData()
  formData.append("profileImage", file)

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/setting/profile`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  )

  const resData = await response.json()
  if (!response.ok) {
    throw new Error(resData.message || "Failed to upload image")
  }

  return resData
}

export async function getProfile(token: string): Promise<ProfileResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/setting/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
  const resData = await response.json()
  if (!response.ok) {
    throw new Error(resData.message || "Failed to get profile")
  }
  return resData
}

export interface ProfileUpdatePayload {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  jobTitle?: string;
  bio?: string;
  location?: string;
}

export async function updateProfileInfo(token: string, payload: ProfileUpdatePayload) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/setting/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Failed to update profile");
  return resData;
}

export async function changePassword(token: string, payload: { oldPassword: string; newPassword: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/setting/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const resData = await response.json();
  if (!response.ok) throw new Error(resData.message || "Failed to update password");
  return resData;
}
