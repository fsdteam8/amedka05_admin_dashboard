
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { changePassword, getProfile, ProfileUpdatePayload, updateProfileInfo, uploadAvatar } from "@/lib/profileInfo"
import { ProfileResponse } from "@/types/userDataType"
import { forgetPassword, resetPassword, veryfyOtpApi } from "@/lib/auth"
import { useRouter } from "next/navigation"

export function useAvatarMutation(
  token: string,
  setAvatar: (val: File | null) => void
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file, token),
    onSuccess: () => {
      toast.success("Avatar updated successfully")
      queryClient.invalidateQueries({ queryKey: ["avatar"] })
      setAvatar(null)
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message || "Image upload failed")
      } else {
        toast.error("Image upload failed")
      }
    },
  })
}

export function useProfileQuery(token: string | undefined) {
  return useQuery<ProfileResponse>({
    queryKey: ["me"],
    queryFn: () => {
      if (!token) throw new Error("Token is missing")
      return getProfile(token)
    },
    enabled: !!token,
  })
}

export function useProfileInfoUpdate(token: string, onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProfileUpdatePayload) => updateProfileInfo(token, payload),
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) toast.error(error.message || "Update failed");
      else toast.error("Update failed");
    },
  });
}

export function useChnagePassword(token: string, onSuccessCallback?: () => void) {

  return useMutation({
    mutationFn: (payload: { oldPassword: string; newPassword: string }) => changePassword(token, payload),
    onSuccess: (data) => {
      toast.success(data?.message || "Password updated successfully");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) toast.error(error.message || "Update failed");
      else toast.error("Update failed");
    },
  });
}

export function useForgetPassword(onSuccessCallback?: () => void) {
  const router = useRouter()

  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (email: string) => forgetPassword(email),
    onSuccess: (_data, email) => {
      toast.success("Check your email for password reset OTP")
      router.push(`/otp?email=${encodeURIComponent(email)}`)

      if (onSuccessCallback) onSuccessCallback()
    },
    onError: (error: unknown) => {
      if (error instanceof Error) toast.error(error.message || "Update failed")
      else toast.error("Update failed")
    },
  })
}


export function useVerifyOtp(onSuccessCallback?: () => void) {
  const router = useRouter()

  return useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: (payload: { email: string; otp: string }) => veryfyOtpApi(payload),
    onSuccess: (_data, email) => {
      toast.success(_data.message || "otp verified successfully")
      router.push(`/reset-password?email=${encodeURIComponent(email.email)}`)

      if (onSuccessCallback) onSuccessCallback()
    },
    onError: (error: unknown) => {
      if (error instanceof Error) toast.error(error.message || "Update failed")
      else toast.error("Update failed")
    }
  })
}

export function usePasswordReset(onSuccessCallback?: () => void) {
  const router = useRouter()

  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: (payload: { email: string; newPassword: string }) => resetPassword(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Password Change successfully!")
      router.push(`/login`)

      if (onSuccessCallback) onSuccessCallback()
    },
    onError: (error: unknown) => {
      if (error instanceof Error) toast.error(error.message || "Update failed")
      else toast.error("Update failed")
    }
  })
}

