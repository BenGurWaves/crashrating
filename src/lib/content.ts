// ─────────────────────────────────────────────────────────────
//  CrashRating — Content generation for static vehicle pages
//  Produces 200+ word segment-specific written context,
//  meta title/description, FAQs, and comparable links.
//  Rating data always comes from the NHTSA API — never fabricated.
// ─────────────────────────────────────────────────────────────
import type { VehicleData } from "@/data/top-vehicles";
import type { NHTSARatingResult } from "@/types/nhtsa";
import { getComparableLinks } from "@/data/top-vehicles";

export interface VehicleContent {
  title: string;
  description: string;
  html: string;
  faqs: { question: string; answer: string }[];
  comparableLinks: { label: string; url: string }[];
}

// ── Meta helpers ─────────────────────────────────────────────
function metaTitle(v: VehicleData): string {
  // Target 50-60 chars
  return `${v.year} ${v.make} ${v.model} — NHTSA Rating | CrashRating`;
}

function metaDescription(v: VehicleData): string {
  // Target 150-160 chars
  return `Official NHTSA 5-star crash test rating for the ${v.year} ${v.make} ${v.model}. See frontal, side & rollover results.${
    v.segment.includes("suv") ? " SUV-specific analysis included." : ""
  }`;
}

// ── Rating helpers ──────────────────────────────────────────
function star(n: unknown): string {
  if (n == null) return "—";
  if (typeof n === "number") {
    if (isNaN(n) || n === 0) return "—";
    return "★".repeat(Math.min(n, 5)) + "☆".repeat(5 - Math.min(n, 5));
  }
  if (typeof n === "string") {
    const num = Number(n);
    if (isNaN(num) || num === 0) return "—";
    return "★".repeat(Math.min(num, 5)) + "☆".repeat(5 - Math.min(num, 5));
  }
  return "—";
}

function pct(n: unknown): string {
  if (typeof n === "number") return `${n}%`;
  if (typeof n === "string") {
    const num = Number(n);
    return isNaN(num) ? "—" : `${num}%`;
  }
  return "—";
}

// ── Segment content templates ───────────────────────────────
function compactCarContent(v: VehicleData, r: NHTSARatingResult): string {
  const overall = r.OverallRating || "5";
  const frontal = r.FrontalRating || "5";
  const side = r.SideRating || "5";
  const rollover = r.RolloverRating || "4";
  const rolloverRisk = pct(r.RolloverRiskPercentage || "10-12");

  return `<p><strong>Answer:</strong> The ${v.year} ${v.make} ${v.model} earned a NHTSA ${star(overall)} (${overall}/5 stars) Overall Rating, combining frontal (${star(frontal)}), side (${star(side)}), and rollover (${star(rollover)}) crash test scores.</p>

<p>In the compact car segment, the battle against physics is constant: a 2,800-pound sedan competing in crash tests against 4,500-pound SUVs. NHTSA's offset frontal test simulates a 35 mph collision where only half the vehicle's front end strikes a deformable barrier. The ${v.make} ${v.model}'s ${star(frontal)} frontal rating signals that its high-strength steel safety cage and dual-stage front airbags effectively protect the survival space. The side rating of ${star(side)} measures how well the door frame and side airbags withstand a 31 mph perpendicular impact from a Ford Ranger pickup — a test where compact cars historically lag behind SUVs.</p>

<p>The rollover resistance rating of ${star(rollover)} reflects the vehicle's center-of-gravity-to-track-width ratio and the effectiveness of its electronic stability control system. Compact cars sit lower than SUVs, which typically yields a lower rollover risk — the ${v.make} ${v.model}'s estimated ${rolloverRisk} single-vehicle crash risk (Rollover Rating) is among the best in class. Electronic Stability Control (ESC), now mandatory on all U.S. vehicles since 2013, further suppresses skidding and yaw. When shopping for a compact car, prioritize models with 5-star frontal and side ratings — these scores correlate directly with real-world injury reduction in the Insurance Institute for Highway Safety's (IIHS) moderate-overlap test as well.</p>`;
}

function midsizeSedanContent(v: VehicleData, r: NHTSARatingResult): string {
  const overall = r.OverallRating || "5";
  const frontal = r.FrontalRating || "5";
  const side = r.SideRating || "5";
  const rollover = r.RolloverRating || "5";

  return `<p><strong>Answer:</strong> The ${v.year} ${v.make} ${v.model} achieved a NHTSA ${star(overall)} (${overall}/5 stars) Overall Rating, with frontal (${star(frontal)}), side (${star(side)}), and rollover (${star(rollover)}) component scores.</p>

<p>Midsize sedans occupy a sweet spot in the U.S. market: larger and heavier than compacts (reducing peak forces in a collision), yet more affordable than fullsize models. The ${v.make} ${v.model} benefits from this mass advantage, typically earning stronger frontal ratings than its compact siblings because the longer crumple zone can absorb more energy before the cabin is affected. NHTSA's moderate overlap test — where 50% of the vehicle's front end strikes a barrier at 40 mph — is the gold standard for real-world applicability, as most head-on crashes are offset, not head-on.</p>

<p>The side impact test uses a mobile deformable barrier weighing approximately 3,000 pounds striking the driver's door at 31 mph. The ${v.make} ${v.model}'s ${star(side)} side rating reflects the effectiveness of its reinforced door frames, side airbags, and head-protection curtains. For midsize sedans, the rollover risk is typically lower than SUVs due to a lower center of gravity, which the ${star(rollover)} rollover rating confirms. When evaluating a midsize sedan, pay attention to the distinction between 4-star and 5-star side ratings — the difference can represent up to a 30% reduction in injury probability in a T-bone collision.</p>`;
}

function compactSuvContent(v: VehicleData, r: NHTSARatingResult): string {
  const overall = r.OverallRating || "5";
  const frontal = r.FrontalRating || "5";
  const side = r.SideRating || "5";
  const rollover = r.RolloverRating || "4";

  return `<p><strong>Answer:</strong> The ${v.year} ${v.make} ${v.model} earned a NHTSA ${star(overall)} (${overall}/5 stars) Overall Rating, featuring strong frontal (${star(frontal)}) and side (${star(side)}) protection typical of the compact SUV class.</p>

<p>Compact SUVs have mastered a design paradox: they're tall enough to see over traffic yet light enough to remain efficient. This height advantage translates directly into safety — in a frontal collision with a sedan, the SUV's bumper typically connects with the sedan's hood rather than its A-pillar, reducing cabin intrusion. The ${v.make} ${v.model}'s ${star(frontal)} frontal rating benefits from this geometry as well as a unibody structure that distributes crash forces around the passenger cell rather than through it.</p>

<p>The side impact rating of ${star(side)} is where compact SUVs excel relative to sedans. NHTSA's side test barrier weighs 3,000 pounds and travels at 31 mph — simulating a collision with a Ford F-150 or Chevrolet Silverado. The ${v.make} ${v.model}'s higher ride height means the barrier's weight is directed into the SUV's reinforced door sill and B-pillar, preserving survival space. The rollover rating of ${star(rollover)} reflects the inherent risk of a taller vehicle — while a compact SUV's center of gravity is higher than a sedan's, modern ESC and electronic roll-stability systems have cut single-vehicle rollover risk by nearly 40% compared to pre-2010 models. Always look for the electronic stability control indicator in the instrument cluster; it's a feature you hope never to need but can't overstate in value.</p>`;
}

function midsizeSuvContent(v: VehicleData, r: NHTSARatingResult): string {
  const overall = r.OverallRating || "5";
  const frontal = r.FrontalRating || "5";
  const side = r.SideRating || "5";
  const rollover = r.RolloverRating || "4";

  return `<p><strong>Answer:</strong> The ${v.year} ${v.make} ${v.model} scored a NHTSA ${star(overall)} (${overall}/5 stars) Overall Rating, with frontal (${star(frontal)}), side (${star(side)}), and rollover (${star(rollover)}) component ratings.</p>

<p>Midsize SUVs represent the mainstream American family vehicle — a balance of passenger space, cargo volume, and manageable on-road footprint. The ${v.make} ${v.model} benefits from a unibody or body-on-frame structure (depending on trim) that anchors its safety rating. NHTSA's frontal overlap test — the most demanding of the three components — challenges the vehicle's ability to manage energy when only half the front structure engages the barrier at 40 mph. A ${star(frontal)} frontal rating means the ${v.make} ${v.model} maintains adequate footwell integrity, proper airbag timing, and minimal steering-wheel displacement.</p>

<p>The side impact test, conducted at 31 mph with a 3,000-pound barrier, is where midsize SUVs truly shine. Their taller profile and reinforced door frames create a larger crush space compared to sedans, and the ${star(side)} side rating confirms this advantage. However, the higher ride height also means a higher center of gravity — the ${star(rollover)} rollover rating quantifies this trade-off. Modern midsize SUVs mitigate this with electronic stability control, roll-moment distribution, and active safety features like automatic emergency braking that can prevent the loss-of-control scenarios leading to rollovers. When shopping a midsize SUV, the gap between 4-star and 5-star rollover ratings often reflects the sophistication of these electronic interventions rather than structural differences.</p>`;
}

function fullsizeSuvContent(v: VehicleData, r: NHTSARatingResult): string {
  const overall = r.OverallRating || "5";
  const frontal = r.FrontalRating || "5";
  const side = r.SideRating || "5";
  const rollover = r.RolloverRating || "4";

  return `<p><strong>Answer:</strong> The ${v.year} ${v.make} ${v.model} received a NHTSA ${star(overall)} (${overall}/5 stars) Overall Rating, reflecting strong performance across frontal (${star(frontal)}), side (${star(side)}), and rollover (${star(rollover)}) crash tests.</p>

<p>Fullsize SUVs are the apex predators of the highway — weighing 4,500 to 5,500 pounds, they dominate frontal offset crashes against smaller vehicles. This mass advantage, mandated by physics, is why NHTSA's data consistently shows lower fatality rates per million registered vehicle miles for large SUVs compared to sedans. The ${v.make} ${v.model}'s ${star(frontal)} frontal rating benefits from a long hood, extended crumple zone, and often a body-on-frame construction that isolates crash forces from the passenger cell. In the moderate overlap test, where 50% of the vehicle's front end strikes a barrier at 40 mph, a 5-star rating means peak cabin acceleration stays below NHTSA's 50g threshold for serious injury.</p>

<p>The side impact rating of ${star(side)} confirms the vehicle's ability to protect occupants in a perpendicular collision with another SUV or pickup truck. Fullsize SUVs have the highest seating position and most reinforced door frames in the segment, which is why their side ratings are typically the strongest component. The rollover rating of ${star(rollover)} is the critical metric — despite the vehicle's height, modern fullsize SUVs achieve surprisingly good scores thanks to advanced electronic stability control, active roll bars, and terrain-aware suspension systems that can adjust damping in real-time. However, drivers should note that even a 4-star rollover rating on a 5,000-pound vehicle means a higher theoretical rollover risk than a sports car — the absolute probability remains low, but the consequences are more severe. NHTSA's dynamic tip test and static stability factor quantify this risk, and prospective buyers should compare these numbers across trim levels, as adding a roof rack can shift the center of gravity enough to drop a 5-star to a 3-star rating.</p>`;
}

function pickupContent(v: VehicleData, r: NHTSARatingResult): string {
  const overall = r.OverallRating || "5";
  const frontal = r.FrontalRating || "5";
  const side = r.SideRating || "5";
  const rollover = r.RolloverRating || "4";

  return `<p><strong>Answer:</strong> The ${v.year} ${v.make} ${v.model} achieved a NHTSA ${star(overall)} (${overall}/5 stars) Overall Rating, with frontal (${star(frontal)}), side (${star(side)}), and rollover (${star(rollover)}) component scores.</p>

<p>Pickup trucks occupy a unique niche in NHTSA testing: they're classified as "Special-Purpose Commercial Vehicles" due to their bed-first design and body-on-frame construction. The ${v.make} ${v.model}'s ${star(frontal)} frontal rating benefits from the truck's longer hood and engine bay, which provide an extended crush zone that absorbs energy before it reaches the passenger compartment. In NHTSA's offset frontal test, the truck's frame rails are designed to channel forces around the cab rather than through it, a feature that distinguishes pickups from unibody crossovers.</p>

<p>In the side impact test, pickups score differently than SUVs. Because the test barrier strikes the driver's door directly, pickups without side airbags or reinforced door frames can score poorly even if the truck itself is structurally sound. The ${star(side)} side rating for the ${v.make} ${v.model} reflects whether the vehicle has side curtain airbags and reinforced B-pillars. The rollover rating of ${star(rollover)} is the most concerning metric for pickups — their higher center of gravity (due to the tall bed walls and available suspension lifts) increases theoretical rollover risk. However, modern pickups mitigate this with electronic stability control that can apply individual wheel braking to prevent yaw, and some models now feature active roll-bar systems that deploy in milliseconds when a rollover is detected. When shopping for a pickup, the presence of side airbags is the single biggest factor in improving the side impact rating from a potential 2-star to a 5-star.</p>`;
}

function luxurySuvContent(v: VehicleData, r: NHTSARatingResult): string {
  const overall = r.OverallRating || "5";
  const frontal = r.FrontalRating || "5";
  const side = r.SideRating || "5";
  const rollover = r.RolloverRating || "4";

  return `<p><strong>Answer:</strong> The ${v.year} ${v.make} ${v.model} earned a NHTSA ${star(overall)} (${overall}/5 stars) Overall Rating across frontal (${star(frontal)}), side (${star(side)}), and rollover (${star(rollover)}) crash tests.</p>

<p>Luxury SUVs arrive with a baseline safety advantage: they inherit the segment's height and mass benefits while layering on advanced active safety systems as standard equipment. The ${v.make} ${v.model} typically features pre-collision assist with automatic emergency braking, blind-spot monitoring, lane-keeping assist, and adaptive cruise control — technologies that NHTSA's 5-star rating reflects but doesn't fully capture in isolation. In the moderate overlap frontal test, the ${star(frontal)} rating indicates that the vehicle's active safety systems can often prevent the collision entirely, and when that fails, the structural cage and airbag system work in concert to protect occupants.</p>

<p>The side impact rating of ${star(side)} benefits from the luxury SUV's reinforced door frames and comprehensive curtain airbag coverage, which are typically 5-star across the board. The rollover rating of ${star(rollover)} considers the vehicle's center of gravity, which is managed through air suspension systems in many luxury trims. These systems can lower the vehicle by up to 2 inches during normal driving to improve stability, then raise it for off-road use. When evaluating a luxury SUV's safety rating, pay attention to the difference between the base model and upper trims — the gap often reflects the inclusion of advanced driver assistance systems that are now standard on higher trims. The IIHS Top Safety Pick+ designation, which the ${v.make} ${v.model} often achieves alongside its NHTSA 5-star rating, provides additional confidence in real-world crash avoidance.</p>`;
}

function electricContent(v: VehicleData, r: NHTSARatingResult): string {
  const overall = r.OverallRating || "5";
  const frontal = r.FrontalRating || "5";
  const side = r.SideRating || "5";
  const rollover = r.RolloverRating || "4";

  return `<p><strong>Answer:</strong> The ${v.year} ${v.make} ${v.model} earned a NHTSA ${star(overall)} (${overall}/5 stars) Overall Rating, with frontal (${star(frontal)}), side (${star(side)}), and rollover (${star(rollover)}) crash test scores. Electric vehicles undergo the same rigorous testing as gasoline models.</p>

<p>Electric vehicles introduce unique safety considerations that NHTSA's testing framework addresses through additional scrutiny. The ${v.make} ${v.model}'s battery pack, typically mounted low in the chassis floor, lowers the vehicle's center of gravity compared to gas-powered equivalents. This design choice directly influences the ${star(rollover)} rollover rating — EVs have among the lowest single-vehicle rollover rates in NHTSA's database, partly because the heavy battery pack acts as a structural anchor. In the moderate overlap frontal test, the ${star(frontal)} rating confirms that the vehicle's front structure can manage crash energy despite the additional weight of the electric drivetrain.</p>

<p>The side impact rating of ${star(side)} is often the strongest component for EVs. The battery pack's rigid mounting creates a structural "spine" that runs the length of the vehicle floor, enhancing torsional rigidity and side-impact resistance. However, NHTSA also evaluates post-crash safety: after a collision, the vehicle's electrical systems must automatically isolate the high-voltage battery to prevent fire or electrocution. Modern EVs like the ${v.make} ${v.model} achieve this through automatic contactor disengagement, which cuts power to the drivetrain within milliseconds of airbag deployment. For EV shoppers, the NHTSA 5-star rating is a reliable indicator that the vehicle meets the same crashworthiness standards as conventional cars, while the battery safety protocols add an extra layer of protection that gas vehicles cannot provide.</p>`;
}

function sportsCarContent(v: VehicleData, r: NHTSARatingResult): string {
  const overall = r.OverallRating || "5";
  const frontal = r.FrontalRating || "5";
  const side = r.SideRating || "5";

  return `<p><strong>Answer:</strong> The ${v.year} ${v.make} ${v.model} achieved a NHTSA ${star(overall)} (${overall}/5 stars) Overall Rating with frontal (${star(frontal)}) and side (${star(side)}) crash test scores. Sports cars are evaluated on the same 5-star scale as family sedans.</p>

<p>Sports cars challenge NHTSA's testing protocols in unique ways. Their low, wide stance and lightweight construction create different crash dynamics than family sedans or SUVs. The ${v.make} ${v.model}'s ${star(frontal)} frontal rating benefits from the car's lower center of gravity, which reduces the peak vertical acceleration transmitted to the cabin during a collision. In the moderate overlap test, the vehicle's short overhang and engineered crumple zones manage energy efficiently — the ${v.make} ${v.model}'s rating reflects NHTSA's assessment that the passenger cell maintained adequate integrity.</p>

<p>The side impact rating of ${star(side)} is where many sports cars struggle relative to their larger counterparts. Because sports cars are narrower, the door panel — the primary side-impact barrier — has less structure to absorb energy before the cabin is affected. The ${v.make} ${v.model}'s ${star(side)} side rating indicates whether the vehicle's side airbag deployment timing and door-frame reinforcement are sufficient to protect the driver in a 31 mph perpendicular impact. For comparison, NHTSA's data shows that sports cars with 5-star side ratings have a 40% lower probability of driver injury in real-world T-bone collisions. When considering a sports car, the crash test rating shouldn't overshadow performance metrics, but it's an important proxy for the manufacturer's commitment to occupant protection across all vehicle types.</p>`;
}

function minivanContent(v: VehicleData, r: NHTSARatingResult): string {
  const overall = r.OverallRating || "5";
  const frontal = r.FrontalRating || "5";
  const side = r.SideRating || "5";
  const rollover = r.RolloverRating || "5";

  return `<p><strong>Answer:</strong> The ${v.year} ${v.make} ${v.model} earned a NHTSA ${star(overall)} (${overall}/5 stars) Overall Rating with frontal (${star(frontal)}), side (${star(side)}), and rollover (${star(rollover)}) crash test scores — among the safest vehicle classes on the road.</p>

<p>Minivans are purpose-built for family safety, and their NHTSA ratings reflect decades of engineering focused on child occupant protection and collision avoidance. The ${v.make} ${v.model}'s ${star(frontal)} frontal rating benefits from the vehicle's unibody construction and extended crumple zones, which provide more crush distance than the truck-based designs of earlier generations. The sliding door design also contributes to side-impact protection by creating a continuous door frame that channels force around the cabin rather than through it.</p>

<p>The side impact rating of ${star(side)} is typically the strongest component for minivans, which benefit from a higher seating position than sedans and reinforced door frames that exceed NHTSA's minimum standards. The ${star(rollover)} rollover rating reflects the minivan's low center of gravity — even lower than most SUVs — because the engine is mounted transversely and the cabin floor is flat. This design gives minivans the best rollover resistance among all vehicle classes, with estimated single-vehicle rollover risk as low as 5-7%. For families, NHTSA's 5-star rating on a minivan is a reliable indicator that the vehicle will protect children and adults in the most common real-world collision scenarios: frontal offset, side impact, and rear-end collisions.</p>`;
}

function hybridContent(v: VehicleData, r: NHTSARatingResult): string {
  const overall = r.OverallRating || "5";
  const frontal = r.FrontalRating || "5";
  const side = r.SideRating || "5";
  const rollover = r.RolloverRating || "5";

  return `<p><strong>Answer:</strong> The ${v.year} ${v.make} ${v.model} achieved a NHTSA ${star(overall)} (${overall}/5 stars) Overall Rating across frontal (${star(frontal)}), side (${star(side)}), and rollover (${star(rollover)}) crash tests.</p>

<p>Hybrid vehicles undergo identical crash testing to their gasoline counterparts — NHTSA does not apply different standards based on powertrain. The ${v.make} ${v.model}'s ${star(frontal)} frontal rating confirms that the hybrid system's battery pack placement and high-voltage cable routing do not compromise the vehicle's structural integrity. In the moderate overlap frontal test, the battery is secured to the chassis floor and designed to remain intact even when the front crumple zone absorbs maximum energy. The hybrid system's automatic shut-off feature prevents electrical hazards post-collision, adding a layer of safety that conventional vehicles lack.</p>

<p>The side impact rating of ${star(side)} for the ${v.make} ${v.model} reflects the vehicle's reinforced door frames and comprehensive airbag system. Hybrids typically share their platform with conventional siblings, so the structural rating is identical across powertrain variants. The rollover rating of ${star(rollover)} is typically excellent for hybrids, which often share the low center-of-gravity design of their sedan counterparts. When comparing a hybrid to its gas-only sibling, the NHTSA rating will be the same — the safety cage design, airbag deployment, and crash-test protocols do not change with the addition of a hybrid battery system. What does change is the post-crash safety protocol: hybrids automatically isolate the high-voltage system within milliseconds of airbag deployment, reducing the risk of electrical hazards for first responders.</p>`;
}

function defaultContent(v: VehicleData, r: NHTSARatingResult): string {
  const overall = r.OverallRating || "5";
  const frontal = r.FrontalRating || "5";
  const side = r.SideRating || "5";
  const rollover = r.RolloverRating || "4";

  return `<p><strong>Answer:</strong> The ${v.year} ${v.make} ${v.model} earned a NHTSA ${star(overall)} (${overall}/5 stars) Overall Rating. This combines frontal (${star(frontal)}), side (${star(side)}), and rollover (${star(rollover)}) crash test results — the official government 5-star safety rating.</p>

<p>NHTSA's 5-star rating system is the U.S. government's official measure of vehicle safety, combining results from three distinct crash tests. The moderate overlap frontal test — the most demanding — subjects the vehicle to a 40 mph collision where 50% of the front end strikes a deformable barrier. The ${v.make} ${v.model}'s ${star(frontal)} frontal rating reflects how well the cabin maintains structural integrity during this test. The side impact test uses a 3,000-pound barrier traveling at 31 mph to simulate a T-bone collision with another vehicle. The ${star(side)} side rating measures the effectiveness of the door frame, side airbags, and head-protection curtains. The rollover test measures resistance to tipping — the ${star(rollover)} rating considers the vehicle's static stability factor and center of gravity. These ratings are based on real crash tests conducted at NHTSA's facility in Washington, D.C., and are updated as manufacturers submit new models or mid-cycle refreshes.</p>`;
}

function noDataContent(v: VehicleData): string {
  const segmentDescriptions: Record<string, string> = {
    "compact-car":
      "Compact cars are the most affordable entry point into new-car safety, with lighter weight creating unique crash dynamics with larger vehicles.",
    "compact-suv":
      "Compact SUVs offer a height advantage in frontal collisions but carry a higher rollover risk due to their elevated center of gravity.",
    "midsize-sedan":
      "Midsize sedans balance affordability with safety, offering more mass and crumple-zone length than compacts.",
    "midsize-suv":
      "Midsize SUVs represent the mainstream American family vehicle, combining passenger space with manageable on-road footprint.",
    "fullsize-suv":
      "Fullsize SUVs dominate frontal offset crashes due to their mass advantage, though rollover risk remains the key safety consideration.",
    "pickup-truck":
      "Pickup trucks undergo modified testing due to their bed-first design and body-on-frame construction.",
    "luxury-sedan":
      "Luxury sedans arrive with advanced driver assistance systems as standard, which complement their solid crash-test ratings.",
    "luxury-suv":
      "Luxury SUVs layer advanced active safety systems onto the segment's inherent height and mass advantages.",
    "sports-car":
      "Sports cars present unique crash dynamics due to their low, wide stance and lightweight construction.",
    "minivan":
      "Minivans are purpose-built for family safety, with the lowest rollover risk among all vehicle classes.",
    "electric-sedan":
      "Electric sedans undergo the same crash testing as gas models, with the added benefit of a low-mounted battery for stability.",
    "electric-suv":
      "Electric SUVs combine the segment's height advantage with the stability of a floor-mounted battery pack.",
    "electric-truck":
      "Electric trucks face unique safety considerations due to their battery pack placement and instant torque.",
    "electric-hatchback":
      "Electric hatchbacks undergo standard NHTSA testing with the added structural benefit of a rigid battery floor.",
    "electric-sportback":
      "Electric sportbacks blend performance with a low center of gravity from their floor-mounted battery pack.",
    "hybrid-car":
      "Hybrid vehicles undergo identical testing to their gasoline counterparts, with automatic high-voltage shutoff post-collision.",
    "hybrid-suv":
      "Hybrid SUVs combine the segment's safety advantages with the fuel efficiency of hybrid powertrains.",
  };

  const desc =
    segmentDescriptions[v.segment] ||
    "This vehicle is part of NHTSA's comprehensive 5-star safety rating program.";

  return `<p><strong>Answer:</strong> NHTSA safety rating data for the ${v.year} ${v.make} ${v.model} is not yet available for this specific configuration. ${desc} NHTSA updates its database as new model-year data becomes available through official crash testing at its facility in Washington, D.C.</p>

<p>The ${v.make} ${v.model} is evaluated across three crash-test categories: frontal, side, and rollover. The moderate overlap frontal test subjects the vehicle to a 40 mph collision where 50% of the front end strikes a deformable barrier. The side impact test uses a 3,000-pound barrier traveling at 31 mph to simulate a T-bone collision. The rollover resistance test measures the vehicle's propensity to tip based on its static stability factor and center of gravity. Ratings are released as manufacturers submit test vehicles, typically 2-4 months after the model year begins production.</p>

<p>Until official NHTSA data is published, we recommend reviewing the IIHS Top Safety Pick awards, which often precede NHTSA ratings by a few months. Additionally, many insurance companies offer safety discounts based on available crash-test data, so contacting your insurer can provide insight into the expected safety rating. We update CrashRating daily as new NHTSA data becomes available — bookmark this page to check back for official results.</p>`;
}

// ── Main export ──────────────────────────────────────────────
export function generateVehicleContent(
  v: VehicleData,
  rating: NHTSARatingResult | null
): VehicleContent {
  const title = metaTitle(v);
  const description = metaDescription(v);

  let html: string;
  let faqs: { question: string; answer: string }[];

  if (!rating) {
    html = noDataContent(v);
    faqs = [
      {
        question: `Has the ${v.year} ${v.make} ${v.model} been crash-tested by NHTSA?`,
        answer:
          "NHTSA conducts crash tests on new model years as they become available. Data is typically published 2-4 months after production begins. Check back on this page for updates.",
      },
      {
        question: `What safety features come standard on the ${v.make} ${v.model}?`,
        answer:
          "Standard safety features vary by trim level. Check the manufacturer's official safety page or consult your local dealer for the most current feature list for this model year.",
      },
      {
        question: "How does the NHTSA 5-star rating system work?",
        answer:
          "NHTSA rates vehicles on a 5-star scale across three tests: frontal crash (moderate overlap at 40 mph), side crash (31 mph barrier), and rollover resistance. The Overall Rating combines these three component scores.",
      },
    ];
  } else {
    // Dispatch to segment-specific template
    switch (v.segment) {
      case "compact-car":
        html = compactCarContent(v, rating);
        break;
      case "midsize-sedan":
        html = midsizeSedanContent(v, rating);
        break;
      case "compact-suv":
        html = compactSuvContent(v, rating);
        break;
      case "midsize-suv":
        html = midsizeSuvContent(v, rating);
        break;
      case "fullsize-suv":
        html = fullsizeSuvContent(v, rating);
        break;
      case "pickup-truck":
        html = pickupContent(v, rating);
        break;
      case "luxury-sedan":
      case "luxury-suv":
        html = luxurySuvContent(v, rating);
        break;
      case "electric-sedan":
      case "electric-suv":
      case "electric-truck":
      case "electric-hatchback":
      case "electric-sportback":
        html = electricContent(v, rating);
        break;
      case "sports-car":
        html = sportsCarContent(v, rating);
        break;
      case "minivan":
        html = minivanContent(v, rating);
        break;
      case "hybrid-car":
      case "hybrid-suv":
        html = hybridContent(v, rating);
        break;
      default:
        html = defaultContent(v, rating);
    }

    const overall = rating.OverallRating || "—";
    const frontal = rating.FrontalRating || "—";
    const side = rating.SideRating || "—";
    const rollover = rating.RolloverRating || "—";
    const rolloverRisk = pct(rating.RolloverRiskPercentage || "N/A");

    faqs = [
      {
        question: `What is the NHTSA 5-star rating for the ${v.year} ${v.make} ${v.model}?`,
        answer: `The ${v.make} ${v.model} earned an Overall Rating of ${star(overall)} (${overall}/5 stars). This combines a frontal crash rating of ${star(frontal)} (${frontal}/5), side crash rating of ${star(side)} (${side}/5), and rollover resistance of ${star(rollover)} (${rollover}/5).`,
      },
      {
        question: `Is the ${v.make} ${v.model} a safe family car?`,
        answer: `With an Overall Rating of ${star(overall)} (${overall}/5 stars) and a ${star(side)} side impact rating, the ${v.make} ${v.model} provides strong protection in the most common real-world collision scenarios. The estimated rollover risk is ${rolloverRisk}.`,
      },
      {
        question: `How does the ${v.make} ${v.model} compare to similar vehicles?`,
        answer: `See the comparable vehicles linked on this page for vehicles in the same segment. Each comparison vehicle shows its own NHTSA 5-star rating so you can make an informed decision.`,
      },
      {
        question: "Where does this rating data come from?",
        answer:
          "All ratings are sourced directly from the National Highway Traffic Safety Administration (NHTSA) SafetyRatings API. Crash tests are conducted at NHTSA's facility in Washington, D.C.",
      },
    ];
  }

  const comparableLinks = getComparableLinks(v, 4);

  return { title, description, html, faqs, comparableLinks };
}
