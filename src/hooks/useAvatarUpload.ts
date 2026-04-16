import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

type UploadAvatarArgs = {
  file: Blob;
  userId: string;
};

type UploadAvatarResult = {
  url: string;
  path: string;
};

const AVATAR_BUCKET = "avatars";

async function listExistingAvatars(userId: string): Promise<string[]> {
  const { data, error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .list(userId);
  if (error || !data) return [];
  return data.map((entry) => `${userId}/${entry.name}`);
}

async function uploadAvatar({
  file,
  userId,
}: UploadAvatarArgs): Promise<UploadAvatarResult> {
  const path = `${userId}/avatar-${Date.now()}.webp`;

  const { error: uploadError } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, {
      contentType: "image/webp",
      cacheControl: "3600",
      upsert: false,
    });
  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", userId);
  if (profileError) throw profileError;

  // Best-effort cleanup of previous avatars; don't fail the mutation if it errors.
  const existing = await listExistingAvatars(userId);
  const stale = existing.filter((p) => p !== path);
  if (stale.length > 0) {
    await supabase.storage.from(AVATAR_BUCKET).remove(stale);
  }

  return { url: publicUrl, path };
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  return useMutation<UploadAvatarResult, Error, UploadAvatarArgs>({
    mutationFn: uploadAvatar,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["profile", variables.userId],
      });
    },
  });
}

type DeleteAvatarArgs = {
  userId: string;
};

async function deleteAvatar({ userId }: DeleteAvatarArgs): Promise<void> {
  const existing = await listExistingAvatars(userId);
  if (existing.length > 0) {
    const { error } = await supabase.storage
      .from(AVATAR_BUCKET)
      .remove(existing);
    if (error) throw error;
  }
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", userId);
  if (profileError) throw profileError;
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, DeleteAvatarArgs>({
    mutationFn: deleteAvatar,
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: ["profile", variables.userId],
      });
    },
  });
}
