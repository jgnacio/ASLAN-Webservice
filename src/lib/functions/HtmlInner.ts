export function createMarkup(c: string | undefined) {
  if (!c) return { __html: "" };

  return { __html: c };
}
