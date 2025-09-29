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
