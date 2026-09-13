// HTML과 이미지는 해석하지 않는다. 링크는 로컬 절대 경로와 HTTP(S)만 허용한다.
export function safeMarkdownUrl(value: string) {
  if (/^\/(?!\/)/.test(value) && !/[\\\s]/.test(value)) return value;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}
