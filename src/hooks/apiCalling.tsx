import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { uploadAvatar } from "@/lib/profileInfo"

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
