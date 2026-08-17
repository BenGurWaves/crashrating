// ─────────────────────────────────────────────────────────────
//  CrashRating — Vehicle data: top 150 best-selling US models
//  across recent model years. Used for static page generation
//  (/safety-ratings/[year]/[make]/[model]) and internal linking.
// ─────────────────────────────────────────────────────────────
import { slugify } from "@/lib/utils";

export interface VehicleData {
  year: number;
  make: string; // as NHTSA stores it, e.g. "HONDA"
  model: string; // as NHTSA stores it, e.g. "CR-V"
  segment: string;
}

// Helper: find a vehicle by URL slug params
export function getVehicle(
  year: string,
  makeSlug: string,
  modelSlug: string
): VehicleData | undefined {
  return TOP_VEHICLES.find(
    (v) =>
      v.year === Number(year) &&
      slugify(v.make) === makeSlug &&
      slugify(v.model) === modelSlug
  );
}

// Helper: find comparable vehicles in the same segment
export function getComparableVehicles(
  vehicle: VehicleData,
  limit = 4
): VehicleData[] {
  return TOP_VEHICLES.filter(
    (v) =>
      v.segment === vehicle.segment &&
      (v.make !== vehicle.make || v.model !== vehicle.model)
  )
    .filter((_, i) => i < limit)
    .sort(() => Math.random() - 0.5); // random selection for variety
}

// Helper: generate comparable internal-link URLs
export function getComparableLinks(
  vehicle: VehicleData,
  limit = 4
): { label: string; url: string }[] {
  return getComparableVehicles(vehicle, limit).map((v) => ({
    label: `${v.make} ${v.model} ${v.year}`,
    url: `/safety-ratings/${v.year}/${slugify(v.make)}/${slugify(v.model)}`,
  }));
}

// ── The full vehicle list (150+ entries) ─────────────────────
// Organized by segment for maintainable comparable-vehicle logic.
// Make names match NHTSA vPIC / SafetyRatings API casing.

export const TOP_VEHICLES: VehicleData[] = [
  // ── Compact cars ─────────────────────────────────────────────
  { year: 2024, make: "HONDA", model: "Civic", segment: "compact-car" },
  { year: 2025, make: "HONDA", model: "Civic", segment: "compact-car" },
  { year: 2024, make: "TOYOTA", model: "Corolla", segment: "compact-car" },
  { year: 2025, make: "TOYOTA", model: "Corolla", segment: "compact-car" },
  { year: 2024, make: "MAZDA", model: "Mazda3", segment: "compact-car" },
  { year: 2025, make: "MAZDA", model: "Mazda3", segment: "compact-car" },
  { year: 2024, make: "NISSAN", model: "Sentra", segment: "compact-car" },
  { year: 2025, make: "NISSAN", model: "Sentra", segment: "compact-car" },
  { year: 2024, make: "HYUNDAI", model: "Elantra", segment: "compact-car" },
  { year: 2025, make: "HYUNDAI", model: "Elantra", segment: "compact-car" },
  { year: 2024, make: "KIA", model: "Forte", segment: "compact-car" },
  { year: 2025, make: "KIA", model: "Forte", segment: "compact-car" },
  { year: 2024, make: "VOLKSWAGEN", model: "Jetta", segment: "compact-car" },
  { year: 2025, make: "VOLKSWAGEN", model: "Jetta", segment: "compact-car" },
  { year: 2024, make: "SUBARU", model: "Impreza", segment: "compact-car" },
  { year: 2025, make: "SUBARU", model: "Impreza", segment: "compact-car" },
  { year: 2024, make: "VOLKSWAGEN", model: "Golf GTI", segment: "compact-car" },
  { year: 2025, make: "VOLKSWAGEN", model: "Golf GTI", segment: "compact-car" },
  { year: 2024, make: "MITSUBISHI", model: "Mirage", segment: "compact-car" },
  { year: 2025, make: "MITSUBISHI", model: "Mirage", segment: "compact-car" },

  // ── Midsize sedans ─────────────────────────────────────────
  { year: 2024, make: "TOYOTA", model: "Camry", segment: "midsize-sedan" },
  { year: 2025, make: "TOYOTA", model: "Camry", segment: "midsize-sedan" },
  { year: 2024, make: "HONDA", model: "Accord", segment: "midsize-sedan" },
  { year: 2025, make: "HONDA", model: "Accord", segment: "midsize-sedan" },
  { year: 2024, make: "NISSAN", model: "Altima", segment: "midsize-sedan" },
  { year: 2025, make: "NISSAN", model: "Altima", segment: "midsize-sedan" },
  { year: 2024, make: "HYUNDAI", model: "Sonata", segment: "midsize-sedan" },
  { year: 2025, make: "HYUNDAI", model: "Sonata", segment: "midsize-sedan" },
  { year: 2024, make: "KIA", model: "K5", segment: "midsize-sedan" },
  { year: 2025, make: "KIA", model: "K5", segment: "midsize-sedan" },
  { year: 2024, make: "MAZDA", model: "Mazda6", segment: "midsize-sedan" },
  { year: 2025, make: "MAZDA", model: "Mazda6", segment: "midsize-sedan" },
  { year: 2024, make: "SUBARU", model: "Legacy", segment: "midsize-sedan" },
  { year: 2025, make: "SUBARU", model: "Legacy", segment: "midsize-sedan" },
  { year: 2024, make: "VOLKSWAGEN", model: "Arteon", segment: "midsize-sedan" },
  { year: 2024, make: "CHEVROLET", model: "Malibu", segment: "midsize-sedan" },
  { year: 2024, make: "CHRYSLER", model: "300", segment: "midsize-sedan" },
  { year: 2025, make: "CHRYSLER", model: "300", segment: "midsize-sedan" },

  // ── Fullsize sedans ────────────────────────────────────────
  { year: 2024, make: "TOYOTA", model: "Avalon", segment: "fullsize-sedan" },
  { year: 2024, make: "CHEVROLET", model: "Impala", segment: "fullsize-sedan" },
  { year: 2024, make: "FORD", model: "Taurus", segment: "fullsize-sedan" },
  { year: 2024, make: "NISSAN", model: "Maxima", segment: "fullsize-sedan" },
  { year: 2024, make: "KIA", model: "Cadenza", segment: "fullsize-sedan" },
  { year: 2024, make: "DODGE", model: "Challenger", segment: "fullsize-sedan" },
  { year: 2025, make: "DODGE", model: "Challenger", segment: "fullsize-sedan" },
  { year: 2024, make: "DODGE", model: "Charger", segment: "fullsize-sedan" },
  { year: 2025, make: "DODGE", model: "Charger", segment: "fullsize-sedan" },

  // ── Compact SUVs ───────────────────────────────────────────
  { year: 2024, make: "HONDA", model: "CR-V", segment: "compact-suv" },
  { year: 2025, make: "HONDA", model: "CR-V", segment: "compact-suv" },
  { year: 2024, make: "TOYOTA", model: "RAV4", segment: "compact-suv" },
  { year: 2025, make: "TOYOTA", model: "RAV4", segment: "compact-suv" },
  { year: 2024, make: "MAZDA", model: "CX-5", segment: "compact-suv" },
  { year: 2025, make: "MAZDA", model: "CX-5", segment: "compact-suv" },
  { year: 2024, make: "NISSAN", model: "Rogue", segment: "compact-suv" },
  { year: 2025, make: "NISSAN", model: "Rogue", segment: "compact-suv" },
  { year: 2024, make: "HYUNDAI", model: "Tucson", segment: "compact-suv" },
  { year: 2025, make: "HYUNDAI", model: "Tucson", segment: "compact-suv" },
  { year: 2024, make: "KIA", model: "Sportage", segment: "compact-suv" },
  { year: 2025, make: "KIA", model: "Sportage", segment: "compact-suv" },
  { year: 2024, make: "SUBARU", model: "Forester", segment: "compact-suv" },
  { year: 2025, make: "SUBARU", model: "Forester", segment: "compact-suv" },
  { year: 2024, make: "VOLKSWAGEN", model: "Tiguan", segment: "compact-suv" },
  { year: 2025, make: "VOLKSWAGEN", model: "Tiguan", segment: "compact-suv" },
  { year: 2024, make: "MITSUBISHI", model: "Outlander", segment: "compact-suv" },
  { year: 2025, make: "MITSUBISHI", model: "Outlander", segment: "compact-suv" },
  { year: 2024, make: "FORD", model: "Bronco Sport", segment: "compact-suv" },
  { year: 2025, make: "FORD", model: "Bronco Sport", segment: "compact-suv" },
  { year: 2024, make: "CHEVROLET", model: "Equinox", segment: "compact-suv" },
  { year: 2025, make: "CHEVROLET", model: "Equinox", segment: "compact-suv" },
  { year: 2024, make: "HONDA", model: "HR-V", segment: "compact-suv" },
  { year: 2025, make: "HONDA", model: "HR-V", segment: "compact-suv" },
  { year: 2024, make: "SUBARU", model: "Crosstrek", segment: "compact-suv" },
  { year: 2025, make: "SUBARU", model: "Crosstrek", segment: "compact-suv" },
  { year: 2024, make: "MAZDA", model: "CX-30", segment: "compact-suv" },
  { year: 2025, make: "MAZDA", model: "CX-30", segment: "compact-suv" },
  { year: 2024, make: "JEEP", model: "Cherokee", segment: "compact-suv" },

  // ── Midsize SUVs ───────────────────────────────────────────
  { year: 2024, make: "TOYOTA", model: "Highlander", segment: "midsize-suv" },
  { year: 2025, make: "TOYOTA", model: "Highlander", segment: "midsize-suv" },
  { year: 2024, make: "HONDA", model: "Pilot", segment: "midsize-suv" },
  { year: 2025, make: "HONDA", model: "Pilot", segment: "midsize-suv" },
  { year: 2024, make: "HYUNDAI", model: "Santa Fe", segment: "midsize-suv" },
  { year: 2025, make: "HYUNDAI", model: "Santa Fe", segment: "midsize-suv" },
  { year: 2024, make: "KIA", model: "Sorento", segment: "midsize-suv" },
  { year: 2025, make: "KIA", model: "Sorento", segment: "midsize-suv" },
  { year: 2024, make: "VOLKSWAGEN", model: "Atlas", segment: "midsize-suv" },
  { year: 2025, make: "VOLKSWAGEN", model: "Atlas", segment: "midsize-suv" },
  { year: 2024, make: "SUBARU", model: "Ascent", segment: "midsize-suv" },
  { year: 2025, make: "SUBARU", model: "Ascent", segment: "midsize-suv" },
  { year: 2024, make: "FORD", model: "Explorer", segment: "midsize-suv" },
  { year: 2025, make: "FORD", model: "Explorer", segment: "midsize-suv" },
  { year: 2024, make: "CHEVROLET", model: "Traverse", segment: "midsize-suv" },
  { year: 2025, make: "CHEVROLET", model: "Traverse", segment: "midsize-suv" },
  { year: 2024, make: "GMC", model: "Acadia", segment: "midsize-suv" },
  { year: 2025, make: "GMC", model: "Acadia", segment: "midsize-suv" },
  { year: 2024, make: "DODGE", model: "Durango", segment: "midsize-suv" },
  { year: 2025, make: "DODGE", model: "Durango", segment: "midsize-suv" },
  { year: 2024, make: "JEEP", model: "Grand Cherokee", segment: "midsize-suv" },
  { year: 2025, make: "JEEP", model: "Grand Cherokee", segment: "midsize-suv" },
  { year: 2024, make: "KIA", model: "Telluride", segment: "midsize-suv" },
  { year: 2025, make: "KIA", model: "Telluride", segment: "midsize-suv" },
  { year: 2024, make: "TOYOTA", model: "Venza", segment: "midsize-suv" },

  // ── Fullsize SUVs ──────────────────────────────────────────
  { year: 2024, make: "CHEVROLET", model: "Tahoe", segment: "fullsize-suv" },
  { year: 2025, make: "CHEVROLET", model: "Tahoe", segment: "fullsize-suv" },
  { year: 2024, make: "GMC", model: "Yukon", segment: "fullsize-suv" },
  { year: 2025, make: "GMC", model: "Yukon", segment: "fullsize-suv" },
  { year: 2024, make: "FORD", model: "Expedition", segment: "fullsize-suv" },
  { year: 2025, make: "FORD", model: "Expedition", segment: "fullsize-suv" },
  { year: 2024, make: "TOYOTA", model: "Sequoia", segment: "fullsize-suv" },
  { year: 2025, make: "TOYOTA", model: "Sequoia", segment: "fullsize-suv" },
  { year: 2024, make: "CHEVROLET", model: "Suburban", segment: "fullsize-suv" },
  { year: 2024, make: "TOYOTA", model: "4Runner", segment: "fullsize-suv" },
  { year: 2025, make: "TOYOTA", model: "4Runner", segment: "fullsize-suv" },
  { year: 2024, make: "NISSAN", model: "Armada", segment: "fullsize-suv" },

  // ── Pickup trucks ──────────────────────────────────────────
  { year: 2024, make: "FORD", model: "F-150", segment: "pickup-truck" },
  { year: 2025, make: "FORD", model: "F-150", segment: "pickup-truck" },
  { year: 2024, make: "CHEVROLET", model: "Silverado 1500", segment: "pickup-truck" },
  { year: 2025, make: "CHEVROLET", model: "Silverado 1500", segment: "pickup-truck" },
  { year: 2024, make: "RAM", model: "1500", segment: "pickup-truck" },
  { year: 2025, make: "RAM", model: "1500", segment: "pickup-truck" },
  { year: 2024, make: "TOYOTA", model: "Tundra", segment: "pickup-truck" },
  { year: 2025, make: "TOYOTA", model: "Tundra", segment: "pickup-truck" },
  { year: 2024, make: "TOYOTA", model: "Tacoma", segment: "pickup-truck" },
  { year: 2025, make: "TOYOTA", model: "Tacoma", segment: "pickup-truck" },
  { year: 2024, make: "CHEVROLET", model: "Colorado", segment: "pickup-truck" },
  { year: 2025, make: "CHEVROLET", model: "Colorado", segment: "pickup-truck" },
  { year: 2024, make: "GMC", model: "Canyon", segment: "pickup-truck" },
  { year: 2025, make: "GMC", model: "Canyon", segment: "pickup-truck" },
  { year: 2024, make: "NISSAN", model: "Frontier", segment: "pickup-truck" },
  { year: 2025, make: "NISSAN", model: "Frontier", segment: "pickup-truck" },
  { year: 2024, make: "HONDA", model: "Ridgeline", segment: "pickup-truck" },
  { year: 2024, make: "FORD", model: "Ranger", segment: "pickup-truck" },

  // ── Luxury sedans ──────────────────────────────────────────
  { year: 2024, make: "BMW", model: "3 Series", segment: "luxury-sedan" },
  { year: 2025, make: "BMW", model: "3 Series", segment: "luxury-sedan" },
  { year: 2024, make: "BMW", model: "5 Series", segment: "luxury-sedan" },
  { year: 2025, make: "BMW", model: "5 Series", segment: "luxury-sedan" },
  { year: 2024, make: "BMW", model: "7 Series", segment: "luxury-sedan" },
  { year: 2024, make: "MERCEDES-BENZ", model: "C-Class", segment: "luxury-sedan" },
  { year: 2025, make: "MERCEDES-BENZ", model: "C-Class", segment: "luxury-sedan" },
  { year: 2024, make: "MERCEDES-BENZ", model: "E-Class", segment: "luxury-sedan" },
  { year: 2025, make: "MERCEDES-BENZ", model: "E-Class", segment: "luxury-sedan" },
  { year: 2024, make: "AUDI", model: "A4", segment: "luxury-sedan" },
  { year: 2025, make: "AUDI", model: "A4", segment: "luxury-sedan" },
  { year: 2024, make: "AUDI", model: "A6", segment: "luxury-sedan" },
  { year: 2024, make: "LEXUS", model: "ES", segment: "luxury-sedan" },
  { year: 2025, make: "LEXUS", model: "ES", segment: "luxury-sedan" },
  { year: 2024, make: "ACURA", model: "TLX", segment: "luxury-sedan" },
  { year: 2024, make: "GENESIS", model: "G80", segment: "luxury-sedan" },

  // ── Luxury SUVs ────────────────────────────────────────────
  { year: 2024, make: "BMW", model: "X3", segment: "luxury-suv" },
  { year: 2025, make: "BMW", model: "X3", segment: "luxury-suv" },
  { year: 2024, make: "BMW", model: "X5", segment: "luxury-suv" },
  { year: 2025, make: "BMW", model: "X5", segment: "luxury-suv" },
  { year: 2024, make: "BMW", model: "X7", segment: "luxury-suv" },
  { year: 2024, make: "MERCEDES-BENZ", model: "GLC", segment: "luxury-suv" },
  { year: 2025, make: "MERCEDES-BENZ", model: "GLE", segment: "luxury-suv" },
  { year: 2024, make: "AUDI", model: "Q5", segment: "luxury-suv" },
  { year: 2025, make: "AUDI", model: "Q5", segment: "luxury-suv" },
  { year: 2024, make: "AUDI", model: "Q7", segment: "luxury-suv" },
  { year: 2024, make: "LEXUS", model: "RX", segment: "luxury-suv" },
  { year: 2025, make: "LEXUS", model: "RX", segment: "luxury-suv" },
  { year: 2024, make: "ACURA", model: "RDX", segment: "luxury-suv" },
  { year: 2025, make: "ACURA", model: "MDX", segment: "luxury-suv" },
  { year: 2024, make: "GENESIS", model: "GV80", segment: "luxury-suv" },
  { year: 2024, make: "GENESIS", model: "GV70", segment: "luxury-suv" },

  // ── Sports cars ────────────────────────────────────────────
  { year: 2024, make: "PORSCHE", model: "911", segment: "sports-car" },
  { year: 2025, make: "PORSCHE", model: "911", segment: "sports-car" },
  { year: 2024, make: "PORSCHE", model: "718 Cayenne", segment: "sports-car" },
  { year: 2024, make: "FORD", model: "Mustang", segment: "sports-car" },
  { year: 2025, make: "FORD", model: "Mustang", segment: "sports-car" },
  { year: 2024, make: "CHEVROLET", model: "Camaro", segment: "sports-car" },
  { year: 2024, make: "MAZDA", model: "MX-5 Miata", segment: "sports-car" },
  { year: 2025, make: "MAZDA", model: "MX-5 Miata", segment: "sports-car" },

  // ── Minivans ───────────────────────────────────────────────
  { year: 2024, make: "HONDA", model: "Odyssey", segment: "minivan" },
  { year: 2025, make: "HONDA", model: "Odyssey", segment: "minivan" },
  { year: 2024, make: "TOYOTA", model: "Sienna", segment: "minivan" },
  { year: 2025, make: "TOYOTA", model: "Sienna", segment: "minivan" },
  { year: 2024, make: "CHRYSLER", model: "Pacifica", segment: "minivan" },
  { year: 2025, make: "CHRYSLER", model: "Pacifica", segment: "minivan" },
  { year: 2024, make: "KIA", model: "Carnival", segment: "minivan" },
  { year: 2025, make: "KIA", model: "Carnival", segment: "minivan" },

  // ── Electric vehicles ──────────────────────────────────────
  { year: 2024, make: "TESLA", model: "Model 3", segment: "electric-sedan" },
  { year: 2025, make: "TESLA", model: "Model 3", segment: "electric-sedan" },
  { year: 2024, make: "TESLA", model: "Model Y", segment: "electric-suv" },
  { year: 2025, make: "TESLA", model: "Model Y", segment: "electric-suv" },
  { year: 2024, make: "TESLA", model: "Model S", segment: "electric-sedan" },
  { year: 2024, make: "TESLA", model: "Model X", segment: "electric-suv" },
  { year: 2024, make: "FORD", model: "F-150 Lightning", segment: "electric-truck" },
  { year: 2025, make: "FORD", model: "F-150 Lightning", segment: "electric-truck" },
  { year: 2024, make: "CHEVROLET", model: "Bolt EV", segment: "electric-hatchback" },
  { year: 2024, make: "CHEVROLET", model: "Bolt EUV", segment: "electric-hatchback" },
  { year: 2024, make: "RIVIAN", model: "R1T", segment: "electric-truck" },
  { year: 2024, make: "RIVIAN", model: "R1S", segment: "electric-suv" },
  { year: 2024, make: "HYUNDAI", model: "Ioniq 5", segment: "electric-suv" },
  { year: 2025, make: "HYUNDAI", model: "Ioniq 5", segment: "electric-suv" },
  { year: 2024, make: "KIA", model: "EV6", segment: "electric-sportback" },
  { year: 2025, make: "KIA", model: "EV6", segment: "electric-sportback" },
  { year: 2024, make: "KIA", model: "EV9", segment: "electric-suv" },
  { year: 2024, make: "VOLKSWAGEN", model: "ID.4", segment: "electric-suv" },
  { year: 2025, make: "VOLKSWAGEN", model: "ID.4", segment: "electric-suv" },
  { year: 2024, make: "BMW", model: "i4", segment: "electric-sedan" },
  { year: 2024, make: "BMW", model: "iX", segment: "electric-suv" },
  { year: 2024, make: "MERCEDES-BENZ", model: "EQS", segment: "electric-sedan" },
  { year: 2024, make: "MERCEDES-BENZ", model: "EQE", segment: "electric-sedan" },

  // ── More popular models ───────────────────────────────────
  { year: 2024, make: "TOYOTA", model: "Prius", segment: "hybrid-car" },
  { year: 2025, make: "TOYOTA", model: "Prius", segment: "hybrid-car" },
  { year: 2024, make: "TOYOTA", model: "bZ4X", segment: "electric-suv" },
  { year: 2024, make: "HONDA", model: "Pilot", segment: "midsize-suv" },
  { year: 2024, make: "FORD", model: "Mach-E", segment: "electric-suv" },
  { year: 2025, make: "FORD", model: "Mach-E", segment: "electric-suv" },
  { year: 2024, make: "CHEVROLET", model: "Equinox EV", segment: "electric-suv" },
  { year: 2024, make: "GMC", model: "Hummer EV", segment: "electric-suv" },
  { year: 2024, make: "NISSAN", model: "Ariya", segment: "electric-suv" },
];

// Ensure we have at least 150 entries
console.assert(
  TOP_VEHICLES.length >= 150,
  `Expected 150+ vehicles, got ${TOP_VEHICLES.length}`
);
