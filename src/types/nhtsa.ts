// ─────────────────────────────────────────────────────────────
//  CrashRating — NHTSA vPIC & SafetyRatings API type definitions
//  Source: https://vpic.nhtsa.dot.gov/api/vehicles/
//  Source: https://queryservices.nhtsa.dot.gov/svc/api/safetyratings/
// ─────────────────────────────────────────────────────────────

// ─── Generic list response (vPIC) ─────────────────────────────

export interface VPRCListResult<T> {
  Count: number;
  Message: string;
  Results: T[];
}

// ─── vPIC: Makes ──────────────────────────────────────────────

export interface VPRCVehicleMake {
  MakeId: number;
  MakeName: string;
  VehicleTypeId: number;
  VehicleTypeName: string;
}

// ─── vPIC: Models ─────────────────────────────────────────────

export interface VPRCVehicleModel {
  ModelId: number;
  ModelName: string;
  MakeId: number;
  MakeName: string;
}

export interface VPRCModelForMakeYear {
  ModelId: number;
  ModelName: string;
  MakeId: number;
  MakeName: string;
  VehicleTypeId?: number;
  VehicleTypeName?: string;
}

// ─── SafetyRatings API ────────────────────────────────────────

export interface NHTSARatingResult {
  // Identifiers
  VehicleId: number;
  VehicleModelDate: number; // model year as integer (e.g. 2024)
  Make: string;
  Model: string;
  ModelYear: string; // model year as string ("2024")
  BodyCabType: string;
  DayOfWeek: string; // e.g. "Wednesday"
  TestType: string | null;

  // ── Overall star ratings (string form, e.g. "5") ────────
  OverallRating: string; // 5-star overall
  OverallFrontCrashRating: string; // frontal
  OverallSideCrashRating: string; // side
  OverallRolloverRating: string; // rollover

  // ── Numeric rating amounts (same as above, as numbers) ───
  OverallRatingAmount: number;
  OverallFrontCrashRatingAmount: number;
  OverallSideCrashRatingAmount: number;
  OverallRolloverRatingAmount: number;

  // ── Frontal crash detail ─────────────────────────────────
  FrontalCrashOverallRatingAmount: number;
  FrontalCrashOveralRating: string; // note the API typo: "Overal"
  FrontalCrashOverlapRating: string; // e.g. "Good", "Acceptable"
  FrontalCrashOverlapRatingAmount: number;
  FrontCrashRatedFrontSeat: string; // front seat rating
  FrontCrashRatedOtherOccupant: string; // other occupant rating
  FrontalDriverFrontalRating: string; // driver frontal rating
  FrontalDriverFrontalRatingAmount: number;
  FrontalPassengerFrontalRating: string; // passenger frontal rating
  FrontalPassengerFrontalRatingAmount: number;

  // ── Side crash detail ────────────────────────────────────
  OverallSideSlideFrontRating: string;
  OverallSideSlideFrontRatingAmount: number;
  OverallSideSlideRearRating: string;
  OverallSideSlideRearRatingAmount: number;
  OverallSidePelvisRating: string;
  OverallSidePelvisRatingAmount: number;
  OverallSideHeadRating: string;
  OverallSideHeadRatingAmount: number;
  OverallSideSeatCmtRating: string; // seat-based rear torso
  OverallSideSeatCmtRatingAmount: number;
  OverallSideOtherOccupantRating: string;
  OverallSideOtherOccupantRatingAmount: number;

  // ── Rollover ─────────────────────────────────────────────
  RolloverRating: string;
  RolloverRatingAmount: number;
  RolloverPossibility: string; // e.g. "11.5" (percentage chance)
  RolloverCurbWeight: string;
  RolloverMaxLoad: string;
  RolloverRatio: string;

  // ── Restraint systems ────────────────────────────────────
  SideAirbags: string;
  SideCurtainAirbags: string;
  SideKneeAirbags: string;
  OtherRestraintSystemsInfo: string;
  OtherRestraintSystems: string;
  NthRestraintSystemInfo: string;
  NthRestraintSystem: string;
  CurbWeight: string;
  NumSeats: string;
  NumRowsOfSeats: string;

  // ── Additional detail fields (often present) ────────────
  [key: string]: unknown;
}

export interface NHTSAListResponse {
  Count: number;
  Message: string;
  Results: NHTSARatingResult[];
}

// ─── Simplified rating view for UI ────────────────────────────

export interface SimplifiedRating {
  vehicleId: number;
  year: number;
  make: string;
  model: string;
  bodyClass: string;
  variantDescription: string; // distinguishes multiple variants of same model
  overallRating: number; // 1-5
  frontalRating: number;
  sideRating: number;
  rolloverRating: number;
  rolloverPossibility: number;
  driverFrontalRating: number;
  passengerFrontalRating: number;
  driverSideRating: number;
  passengerSideRating: number;
  // Raw data for PDF export / detailed view
  rawData: NHTSARatingResult;
}

// ─── Vehicle make/model search form state ─────────────────────

export interface VehicleSpec {
  year: string;
  make: string;
  model: string;
}

export interface VehicleVariant {
  VehicleId: number;
  Make: string;
  Model: string;
  VehicleModelDate: number;
  BodyCabType: string;
  // A human-readable description that distinguishes variants,
  // e.g. "4-door sedan", "2-door coupe", "4WD", "AWD"
  description: string;
}
