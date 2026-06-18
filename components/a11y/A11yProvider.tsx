"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type A11yTheme = "white" | "black" | "beige" | "blue" | "green";
export type A11yFont = "normal" | "large" | "xlarge";
export type A11yToggle = "on" | "off";

export type A11ySettings = {
  enabled: boolean;
  theme: A11yTheme;
  font: A11yFont;
  images: A11yToggle;
  kerning: "normal" | "wide";
};

const DEFAULT: A11ySettings = {
  enabled: false,
  theme: "white",
  font: "large",
  images: "on",
  kerning: "normal",
};

const STORAGE_KEY = "kit-a11y";

const FONT_SCALE: Record<A11yFont, string> = {
  normal: "1",
  large: "1.25",
  xlarge: "1.5",
};

export function applyA11y(s: A11ySettings) {
  if (typeof document === "undefined") return;
  const el = document.documentElement;
  if (s.enabled) {
    el.setAttribute("data-a11y", "on");
    el.setAttribute("data-a11y-theme", s.theme);
    el.setAttribute("data-a11y-images", s.images);
    el.style.setProperty("--a11y-font-scale", FONT_SCALE[s.font]);
    el.style.setProperty(
      "--a11y-letter-spacing",
      s.kerning === "wide" ? "0.14em" : "normal"
    );
  } else {
    el.removeAttribute("data-a11y");
    el.removeAttribute("data-a11y-theme");
    el.removeAttribute("data-a11y-images");
    el.style.removeProperty("--a11y-font-scale");
    el.style.removeProperty("--a11y-letter-spacing");
  }
}

type A11yContextValue = {
  settings: A11ySettings;
  enable: () => void;
  disable: () => void;
  update: (patch: Partial<A11ySettings>) => void;
};

const A11yContext = createContext<A11yContextValue | null>(null);

export function A11yProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<A11ySettings>(DEFAULT);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = { ...DEFAULT, ...JSON.parse(raw) } as A11ySettings;
        setSettings(parsed);
        applyA11y(parsed);
      }
    } catch {
      /* localStorage недоступен — игнорируем */
    }
  }, []);

  const persist = useCallback((next: A11ySettings) => {
    setSettings(next);
    applyA11y(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* игнорируем */
    }
  }, []);

  const enable = useCallback(
    () => persist({ ...DEFAULT, ...settings, enabled: true }),
    [persist, settings]
  );
  const disable = useCallback(
    () => persist({ ...settings, enabled: false }),
    [persist, settings]
  );
  const update = useCallback(
    (patch: Partial<A11ySettings>) => persist({ ...settings, ...patch }),
    [persist, settings]
  );

  return (
    <A11yContext.Provider value={{ settings, enable, disable, update }}>
      {children}
    </A11yContext.Provider>
  );
}

export function useA11y() {
  const ctx = useContext(A11yContext);
  if (!ctx) throw new Error("useA11y must be used within A11yProvider");
  return ctx;
}
