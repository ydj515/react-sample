import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getLibrary,
  getFileContent,
  createFolder,
  uploadFile,
} from "@/features/media/api/media-api";

export const libraryOptions = () =>
  queryOptions({ queryKey: ["media", "library"], queryFn: getLibrary });

export const contentOptions = (id: string) =>
  queryOptions({
    queryKey: ["media", "content", id],
    queryFn: () => getFileContent(id),
    gcTime: 0,
    staleTime: Infinity,
  });

export function useMediaMutations() {
  const client = useQueryClient();

  const onSuccess = async () => {
    await client.invalidateQueries({ queryKey: ["media", "library"] });
  };

  const folder = useMutation({ mutationFn: createFolder, onSuccess });

  const upload = useMutation({
    mutationFn: ({ file, folderId }: { file: File; folderId: string | null }) =>
      uploadFile(file, folderId),
    onSuccess,
  });
  return { folder, upload };
}
