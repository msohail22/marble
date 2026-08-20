import { atom } from "jotai";

export const languageAtom = atom<"en" | "hi">(
  (localStorage.getItem("language") as "en" | "hi") || "en"
);

export const themeAtom = atom<"light" | "dark">(
  (localStorage.getItem("theme") as "light" | "dark") || "light"
);

export const userAtom = atom<{ id: string; name: string } | null>(null);
