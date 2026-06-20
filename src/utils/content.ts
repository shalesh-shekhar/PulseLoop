import { ConfigContentValue } from "../types";

export function renderContent(
  val: ConfigContentValue | undefined,
  lang: string = "en",
): string {
  if (val === undefined || val === null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") {
    // If translation exists for the requested language, use it.
    if (val[lang]) return val[lang];
    // Otherwise fallback to whatever the first key is
    return Object.values(val)[0] || "";
  }
  return String(val);
}
