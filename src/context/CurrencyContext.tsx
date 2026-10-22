"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CurrencyCode = "NGN" | "USD" | "GHS" | "KES";

export type CurrencyMeta = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  flag: string;
  rateFromNgn: number;
};

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  NGN: {
    code: "NGN",
    symbol: "₦",
    label: "₦ NGN",
    flag: "🇳🇬",
    rateFromNgn: 1,
  },
  USD: {
    code: "USD",
    symbol: "$",
    label: "$ USD",
    flag: "🇺🇸",
    rateFromNgn: 1 / 1600,
  },
  GHS: {
    code: "GHS",
    symbol: "GH₵",
    label: "GH₵ GHS",
    flag: "🇬🇭",
    rateFromNgn: 1 / 102,
  },
  KES: {
    code: "KES",
    symbol: "KSh ",
    label: "KSh KES",
    flag: "🇰🇪",
    rateFromNgn: 1 / 12.4,
  },
};

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInNgn: number | string, opts?: { compact?: boolean }) => string;
  currencyMeta: CurrencyMeta;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

const STORAGE_KEY = "izzac_preferred_currency";

export function formatNgnValue(
  amountInNgn: number | string,
  currency: CurrencyCode = "NGN",
  opts?: { compact?: boolean }
): string {
  const numeric = Number(amountInNgn);
  if (!Number.isFinite(numeric)) return "₦0";

  // If a custom test listing entered a small legacy number (< 1000), normalize to NGN scale
  const normalizedNgn = numeric > 0 && numeric < 1000 ? numeric * 1000 : numeric;
  const meta = CURRENCIES[currency] || CURRENCIES.NGN;
  const converted = normalizedNgn * meta.rateFromNgn;

  if (opts?.compact && currency === "NGN" && converted >= 1_000_000) {
    return `${meta.symbol}${(converted / 1_000_000).toFixed(2)}M`;
  }

  const rounded = Math.round(converted);
  return `${meta.symbol}${rounded.toLocaleString("en-NG")}`;
}

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>("NGN");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (saved && CURRENCIES[saved]) {
        setCurrencyState(saved);
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // Ignore storage access errors
    }
  };

  const formatPrice = (
    amountInNgn: number | string,
    opts?: { compact?: boolean }
  ) => formatNgnValue(amountInNgn, currency, opts);

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        currencyMeta: CURRENCIES[currency],
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextValue => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    return {
      currency: "NGN",
      setCurrency: () => {},
      formatPrice: (val, opts) => formatNgnValue(val, "NGN", opts),
      currencyMeta: CURRENCIES.NGN,
    };
  }
  return ctx;
};
