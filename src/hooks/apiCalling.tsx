import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { changePassword, getProfile, ProfileUpdatePayload, updateProfileInfo, uploadAvatar } from "@/lib/profileInfo"
import { ProfileResponse } from "@/types/userDataType"
import { forgetPassword, resetPassword, veryfyOtpApi } from "@/lib/auth"
import { useRouter } from "next/navigation"
import { PartnershipData, PartnershipResponse, SinglePartnershipResponse } from "@/types/partnershipDataType"
import { createPartnership, deletePartnership, getPartnership, getSingelPartnership, updatePartnership } from "@/lib/partnerships"
import { ContactResponse } from "@/types/contactDataType"
import { getContact } from "@/lib/contact"

export function useAvatarMutation(
  token: string,
  setAvatar: (val: File | null) => void
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file, token),
    onSuccess: (data) => {
      toast.success(data.message || "Avatar updated successfully")
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

export function useGetPartnership(token: string | undefined, currentPage: number, itemsPerPage: number) {
  return useQuery<PartnershipResponse>({
    queryKey: ["partnership", currentPage, itemsPerPage],
    queryFn: () => {
      if (!token) throw new Error("Token is missing")
      return getPartnership(token, currentPage, itemsPerPage)
    },
    enabled: !!token,
  })
}

export function useCreatetPartnership(token: string, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PartnershipData) => createPartnership(token, payload),
    onSuccess: () => {
      setIsOpen(false)
      toast.success("Pertnership created successfully");
      queryClient.invalidateQueries({ queryKey: ["partnership"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) toast.error(error.message || "Update failed");
      else toast.error("Update failed");
    },
  });
}

export function useSingelGetPartnership(token: string | undefined, id: string) {
  return useQuery<SinglePartnershipResponse>({
    queryKey: ["singelPartnership", id],
    queryFn: () => {
      if (!token) throw new Error("Token is missing")
      return getSingelPartnership(token, id)
    },
    enabled: !!token,
  })
}

export function useUpdatePartnership(token: string | undefined, id: string, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>, onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PartnershipData) => updatePartnership(token as string, id, payload),
    onSuccess: () => {
      setIsOpen(false)
      toast.success("Pertnership updated successfully");
      queryClient.invalidateQueries({ queryKey: ["singelPartnership"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) toast.error(error.message || "Update failed");
      else toast.error("Update failed");
    },
  });
}

export function useDeletePartnership(token: string | undefined, id: string, onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deletePartnership(token as string, id),
    onSuccess: () => {
      toast.success("Pertnership deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["singelPartnership"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) toast.error(error.message || "Update failed");
      else toast.error("Update failed");
    },
  });
}

export function useGetContact(token: string | undefined, currentPage: number, itemsPerPage: number) {
  return useQuery<ContactResponse>({
    queryKey: ["contact", currentPage, itemsPerPage],
    queryFn: () => {
      if (!token) throw new Error("Token is missing")
      return getContact(token, currentPage, itemsPerPage)
    },
    enabled: !!token,
  })
}
