
export async function uploadAvatar(file: File, token: string) {
  const formData = new FormData()
  formData.append("profileImage", file)

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/upload-avatar`,
    {
      method: "PATCH",
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
