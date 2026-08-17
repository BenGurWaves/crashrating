// ─────────────────────────────────────────────────────────────
//  CrashRating — VehicleSelector
//  Cascading dropdowns: Year → Make → Model.
//  Makes and models are fetched live from NHTSA's vPIC API
//  via dedicated API routes so only valid combinations appear.
// ─────────────────────────────────────────────────────────────
"use client";

import { useState, useEffect } from "react";
import type { VPRCVehicleMake, VPRCModelForMakeYear, VehicleSpec } from "@/types/nhtsa";

// Pre-populated year list — NHTSA ratings go back to ~2010.
// We show the most relevant recent years first.
const YEARS = [
  "2026", "2025", "2024", "2023", "2022", "2021", "2020",
  "2019", "2018", "2017", "2016", "2015", "2014", "2013",
  "2012", "2011", "2010",
];

interface VehicleSelectorProps {
  onSubmit: (spec: VehicleSpec) => void;
  buttonText?: string;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  defaultYear?: string;
  defaultMake?: string;
  defaultModel?: string;
}

export function VehicleSelector({
  onSubmit,
  buttonText = "Check Rating",
  loading = false,
  disabled = false,
  label,
  defaultYear,
  defaultMake,
  defaultModel,
}: VehicleSelectorProps) {
  const [year, setYear] = useState(defaultYear ?? "");
  const [make, setMake] = useState(defaultMake ?? "");
  const [model, setModel] = useState(defaultModel ?? "");

  const [makes, setMakes] = useState<VPRCVehicleMake[]>([]);
  const [models, setModels] = useState<VPRCModelForMakeYear[]>([]);
  const [makesLoading, setMakesLoading] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);

  // ── Fetch makes when year changes ──────────────────────────
  useEffect(() => {
    if (!year) {
      setMakes([]);
      setMake("");
      setModel("");
      setModels([]);
      return;
    }

    let cancelled = false;
    setMakesLoading(true);

    fetch(`/api/vpic/makes?vehicleType=Car`)
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          setMakes(json.success ? json.data : []);
        }
      })
      .catch(() => {
        if (!cancelled) setMakes([]);
      })
      .finally(() => {
        if (!cancelled) setMakesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [year]);

  // ── Fetch models when make changes ────────────────────────
  useEffect(() => {
    if (!make || !year) {
      setModels([]);
      setModel("");
      return;
    }

    let cancelled = false;
    setModelsLoading(true);

    fetch(
      `/api/vpic/models?make=${encodeURIComponent(make)}&year=${year}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          setModels(json.success ? json.data : []);
        }
      })
      .catch(() => {
        if (!cancelled) setModels([]);
      })
      .finally(() => {
        if (!cancelled) setModelsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [make, year]);

  const handleSubmit = () => {
    if (!year || !make || !model) return;
    onSubmit({ year, make, model });
  };

  const isComplete = Boolean(year && make && model);
  const isLoading = loading || makesLoading || modelsLoading;

  return (
    <div className="space-y-3">
      {label && (
        <p className="text-sm font-medium text-text-muted">{label}</p>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
        {/* ── Year ── */}
        <select
          value={year}
          onChange={(e) => {
            setYear(e.target.value);
            setMake("");
            setModel("");
          }}
          className="h-11 rounded border border-border bg-bg-card px-3 text-sm text-text placeholder:text-text-dim focus:border-amber focus:outline-none"
          disabled={isLoading || disabled}
        >
          <option value="">Year</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* ── Make ── */}
        <select
          value={make}
          onChange={(e) => {
            setMake(e.target.value);
            setModel("");
          }}
          className="h-11 rounded border border-border bg-bg-card px-3 text-sm text-text placeholder:text-text-dim focus:border-amber focus:outline-none disabled:opacity-50"
          disabled={!year || makesLoading || isLoading || disabled}
        >
          <option value="">Make</option>
          {makesLoading && <option>Loading…</option>}
          {makes.map((m) => (
            <option key={m.MakeId} value={m.MakeName}>
              {m.MakeName}
            </option>
          ))}
        </select>

        {/* ── Model ── */}
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="h-11 rounded border border-border bg-bg-card px-3 text-sm text-text placeholder:text-text-dim focus:border-amber focus:outline-none disabled:opacity-50 sm:col-span-2"
          disabled={!make || modelsLoading || isLoading || disabled}
        >
          <option value="">Model</option>
          {modelsLoading && <option>Loading…</option>}
          {models.map((m) => (
            <option key={m.ModelId} value={m.ModelName}>
              {m.ModelName}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!isComplete || isLoading || disabled}
        className="w-full rounded bg-amber px-4 py-2.5 text-sm font-bold text-bg transition-colors hover:bg-amber-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-amber"
      >
        {loading ? "Loading…" : buttonText}
      </button>
    </div>
  );
}
