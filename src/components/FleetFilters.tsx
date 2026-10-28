"use client";

import { Chip } from "./layout/Chip";
import { Select } from "./ui/select";
import { Input } from "./ui/input";
import {
  CAR_CATEGORIES,
  type CarCategory,
  MOBILITY_SERVICE_MODES,
  type MobilityServiceMode,
  NIGERIAN_CITY_HUBS,
  type NigerianCityHub,
} from "../lib/carCatalogue";
import { cn } from "@/lib/utils";

export type FleetSortOption = "featured" | "price-asc" | "price-desc" | "year-desc";

export type FleetFilterState = {
  hub: NigerianCityHub;
  service: MobilityServiceMode | "All Modes";
  category: CarCategory | "All";
};

export const DEFAULT_FLEET_FILTERS: FleetFilterState = {
  hub: "All Hubs",
  service: "All Modes",
  category: "All",
};

type FleetFiltersProps = {
  value: FleetFilterState;
  onChange: (next: FleetFilterState) => void;
  counts?: Partial<Record<CarCategory | "All", number>>;
  className?: string;
  /** Optional integrated search query so all controls live in a single bar. */
  search?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  /** Optional max daily rate filter in NGN. */
  maxPrice?: number | "";
  onMaxPriceChange?: (value: number | "") => void;
  /** Optional sort order. */
  sortBy?: FleetSortOption;
  onSortByChange?: (value: FleetSortOption) => void;
  /** Total matched vehicles & total catalogue count for inline status. */
  resultCount?: number;
  totalCount?: number;
  onReset?: () => void;
  /** Hide specific controls when the surrounding page does not need them. */
  show?: {
    hub?: boolean;
    service?: boolean;
    category?: boolean;
    search?: boolean;
    budget?: boolean;
    sort?: boolean;
  };
};

const BUDGET_PRESETS: { label: string; value: number | "" }[] = [
  { label: "Any daily budget", value: "" },
  { label: "Up to ₦100,000 / day", value: 100000 },
  { label: "Up to ₦150,000 / day", value: 150000 },
  { label: "Up to ₦220,000 / day", value: 220000 },
  { label: "Up to ₦300,000 / day", value: 300000 },
];

/**
 * Streamlined executive fleet filter bar:
 * - Single scannable row of Vehicle Class pills (<= 6 mutually exclusive classes).
 * - Compact native <Select> controls for 6+ Hub & Service Mode lists to eliminate multi-row chip clutter.
 */
export function FleetFilters({
  value,
  onChange,
  counts,
  className,
  search,
  onSearchChange,
  searchPlaceholder = "Search make, model, city…",
  maxPrice = "",
  onMaxPriceChange,
  sortBy = "featured",
  onSortByChange,
  onReset,
  show,
}: FleetFiltersProps) {
  const visible = {
    hub: true,
    service: true,
    category: true,
    search: Boolean(onSearchChange),
    budget: Boolean(onMaxPriceChange),
    sort: Boolean(onSortByChange),
    ...show,
  };

  const hasActiveFilters =
    value.hub !== "All Hubs" ||
    value.service !== "All Modes" ||
    value.category !== "All" ||
    Boolean(search && search.trim()) ||
    Boolean(maxPrice) ||
    sortBy !== "featured";

  const resetAll = () => {
    if (onReset) {
      onReset();
      return;
    }
    onChange(DEFAULT_FLEET_FILTERS);
    onSearchChange?.("");
    onMaxPriceChange?.("");
    onSortByChange?.("featured");
  };

  return (
    <div
      role="region"
      aria-label="Fleet filters"
      className={cn("space-y-3", className)}
    >
      {/* Row 1: Primary Class Tabs + Compact Dropdown Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Vehicle Class Pills (Single horizontal rail) */}
        {visible.category && (
          <div
            role="group"
            aria-label="Vehicle class"
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
          >
            <Chip
              active={value.category === "All"}
              count={counts?.All}
              onClick={() => onChange({ ...value, category: "All" })}
              className="h-8 px-3 text-xs"
            >
              All classes
            </Chip>
            {CAR_CATEGORIES.map((category) => (
              <Chip
                key={category}
                active={value.category === category}
                count={counts?.[category]}
                onClick={() => onChange({ ...value, category })}
                className="h-8 px-3 text-xs"
              >
                {category}
              </Chip>
            ))}
          </div>
        )}

        {/* Compact Hub, Mode, Budget, Sort & Search Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          {visible.search && onSearchChange && (
            <div className="relative min-w-[180px] flex-1 sm:w-52 sm:flex-initial">
              <label htmlFor="fleet-filter-search" className="sr-only">
                Search vehicles by make, model, or hub
              </label>
              <Input
                id="fleet-filter-search"
                name="q"
                type="search"
                value={search ?? ""}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="h-9 bg-surface-elevated pl-8 pr-3 text-xs"
              />
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
              >
                <circle cx="7" cy="7" r="4.5" />
                <path d="M10.5 10.5L14 14" strokeLinecap="round" />
              </svg>
            </div>
          )}

          {visible.hub && (
            <div className="min-w-[132px] flex-1 sm:flex-initial">
              <label htmlFor="fleet-filter-hub" className="sr-only">
                City hub
              </label>
              <Select
                id="fleet-filter-hub"
                name="hub"
                value={value.hub}
                onChange={(e) => onChange({ ...value, hub: e.target.value as NigerianCityHub })}
                className={cn(
                  "h-9 pl-3 pr-8 text-xs font-medium",
                  value.hub !== "All Hubs" && "border-primary/60 bg-primary-subtle/50 text-foreground"
                )}
              >
                {NIGERIAN_CITY_HUBS.map((hub) => (
                  <option key={hub} value={hub}>
                    {hub === "All Hubs" ? "Hub: All (6)" : `Hub: ${hub}`}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {visible.service && (
            <div className="min-w-[148px] flex-1 sm:flex-initial">
              <label htmlFor="fleet-filter-service" className="sr-only">
                Mobility service mode
              </label>
              <Select
                id="fleet-filter-service"
                name="service"
                value={value.service}
                onChange={(e) =>
                  onChange({ ...value, service: e.target.value as MobilityServiceMode | "All Modes" })
                }
                className={cn(
                  "h-9 pl-3 pr-8 text-xs font-medium",
                  value.service !== "All Modes" && "border-primary/60 bg-primary-subtle/50 text-foreground"
                )}
              >
                <option value="All Modes">Mode: All modes</option>
                {MOBILITY_SERVICE_MODES.map((mode) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {visible.budget && onMaxPriceChange && (
            <div className="min-w-[148px] flex-1 sm:flex-initial">
              <label htmlFor="fleet-filter-budget" className="sr-only">
                Maximum daily rate
              </label>
              <Select
                id="fleet-filter-budget"
                name="maxPrice"
                value={maxPrice === "" ? "" : String(maxPrice)}
                onChange={(e) =>
                  onMaxPriceChange(e.target.value ? Number(e.target.value) : "")
                }
                className={cn(
                  "h-9 pl-3 pr-8 font-mono text-xs tabular-nums",
                  maxPrice !== "" && "border-primary/60 bg-primary-subtle/50 text-foreground"
                )}
              >
                {BUDGET_PRESETS.map((preset) => (
                  <option key={preset.label} value={preset.value === "" ? "" : String(preset.value)}>
                    {preset.label}
                  </option>
                ))}
              </Select>
            </div>
          )}

          {visible.sort && onSortByChange && (
            <div className="min-w-[140px] flex-1 sm:flex-initial">
              <label htmlFor="fleet-filter-sort" className="sr-only">
                Sort vehicles
              </label>
              <Select
                id="fleet-filter-sort"
                name="sort"
                value={sortBy}
                onChange={(e) => onSortByChange(e.target.value as FleetSortOption)}
                className="h-9 pl-3 pr-8 text-xs"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Rate: Low → High</option>
                <option value="price-desc">Rate: High → Low</option>
                <option value="year-desc">Newest model year</option>
              </Select>
            </div>
          )}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex h-9 shrink-0 items-center gap-1 rounded-md border border-border bg-surface px-2.5 font-mono text-2xs uppercase tracking-[0.06em] text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <span>Reset</span>
              <span aria-hidden="true">×</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FleetFilters;
