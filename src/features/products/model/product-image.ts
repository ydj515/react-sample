export async function readProductImage(file: File): Promise<string> {
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type))
    throw new Error("PNG, JPEG, WebP 파일을 선택하세요.");
  if (file.size > 2 * 1024 * 1024)
    throw new Error("이미지는 2MB 이하로 선택하세요.");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () =>
      reject(new Error("이미지를 읽지 못했습니다. 다시 선택하세요."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}
