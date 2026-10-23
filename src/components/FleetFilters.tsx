"use client";

import { Chip, ChipGroup } from "./layout/Chip";
import {
  CAR_CATEGORIES,
  type CarCategory,
  MOBILITY_SERVICE_MODES,
  type MobilityServiceMode,
  NIGERIAN_CITY_HUBS,
  type NigerianCityHub,
} from "../lib/carCatalogue";
import { cn } from "@/lib/utils";

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
  /** Hide a row when the surrounding page handles it elsewhere. */
  show?: { hub?: boolean; service?: boolean; category?: boolean };
};

/** Shared three-row hub / service / category filter rail. */
export function FleetFilters({ value, onChange, counts, className, show }: FleetFiltersProps) {
  const visible = { hub: true, service: true, category: true, ...show };
  return (
    <div className={cn("space-y-3", className)}>
      {visible.hub && (
        <ChipGroup label="Hub">
          {NIGERIAN_CITY_HUBS.map((hub) => (
            <Chip key={hub} tone="ink" active={value.hub === hub} onClick={() => onChange({ ...value, hub })}>
              {hub}
            </Chip>
          ))}
        </ChipGroup>
      )}
      {visible.service && (
        <ChipGroup label="Mode">
          <Chip active={value.service === "All Modes"} onClick={() => onChange({ ...value, service: "All Modes" })}>
            All modes
          </Chip>
          {MOBILITY_SERVICE_MODES.map((mode) => (
            <Chip key={mode} active={value.service === mode} onClick={() => onChange({ ...value, service: mode })}>
              {mode}
            </Chip>
          ))}
        </ChipGroup>
      )}
      {visible.category && (
        <ChipGroup label="Class">
          <Chip active={value.category === "All"} count={counts?.All} onClick={() => onChange({ ...value, category: "All" })}>
            All
          </Chip>
          {CAR_CATEGORIES.map((category) => (
            <Chip
              key={category}
              active={value.category === category}
              count={counts?.[category]}
              onClick={() => onChange({ ...value, category })}
            >
              {category}
            </Chip>
          ))}
        </ChipGroup>
      )}
    </div>
  );
}

export default FleetFilters;
