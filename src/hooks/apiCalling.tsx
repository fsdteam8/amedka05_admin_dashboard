import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { changePassword, getProfile, ProfileUpdatePayload, updateProfileInfo, uploadAvatar } from "@/lib/profileInfo"
import { ProfileResponse } from "@/types/userDataType"

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
    onSuccess: () => {
      toast.success("Password updated successfully");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) toast.error(error.message || "Update failed");
      else toast.error("Update failed");
    },
  });
}
