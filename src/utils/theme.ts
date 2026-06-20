import { AppConfig } from "../types";

export function applyTheme(theme: AppConfig["theme"]) {
  if (!theme) return;

  const root = document.documentElement;

  // Apply colors
  if (theme.colors) {
    if (theme.colors.primary)
      root.style.setProperty("--color-primary", theme.colors.primary);
    if (theme.colors.background)
      root.style.setProperty("--color-background", theme.colors.background);
    if (theme.colors.surface)
      root.style.setProperty("--color-surface", theme.colors.surface);
    if (theme.colors.text)
      root.style.setProperty("--color-text", theme.colors.text);
    if (theme.colors.mutedText)
      root.style.setProperty("--color-muted-text", theme.colors.mutedText);
    if (theme.colors.accent)
      root.style.setProperty("--color-accent", theme.colors.accent);
  }

  // Apply fonts
  if (theme.fontPrimary)
    root.style.setProperty(
      "--font-primary",
      `"${theme.fontPrimary}", sans-serif`,
    );
  if (theme.fontHeading)
    root.style.setProperty(
      "--font-heading",
      `"${theme.fontHeading}", sans-serif`,
    );
}
