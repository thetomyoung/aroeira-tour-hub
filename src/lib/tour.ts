import heroPines from "@/assets/hero-pines.jpg";
import heroChallenge from "@/assets/hero-challenge.jpg";
import heroClubhouse from "@/assets/hero-clubhouse.jpg";
import heroTerrace from "@/assets/hero-terrace.jpg";
import kailuaSunset from "@/assets/kailua-sunset.jpg";
import kailuaMusic from "@/assets/kailua-music.jpg";
import kailuaCocktails from "@/assets/kailua-cocktails.jpg";
import hotelPoolAsset from "@/assets/hotel-pool-real.jpg.asset.json";
import hotelRestaurantAsset from "@/assets/hotel-restaurant-real.jpg.asset.json";
import hotelTerraceAsset from "@/assets/hotel-terrace-real.jpg.asset.json";

const hotelPoolReal = hotelPoolAsset.url;
const hotelRestaurantReal = hotelRestaurantAsset.url;
const hotelTerraceReal = hotelTerraceAsset.url;

export const KAILUA_IMAGES = [
  { src: kailuaSunset, label: "Sunset over Fonte da Telha" },
  { src: kailuaMusic, label: "Live music on the sand" },
  { src: kailuaCocktails, label: "Cocktails at golden hour" },
];

export const TOUR = {
  name: "SBF Golf Tour 2027",
  place: "Aroeira, Lisbon, Portugal",
  dates: "1st – 4th June 2027",
  startISO: "2027-06-01T06:00:00Z",
  lat: 38.5167,
  lon: -9.2167,
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Aroeira+Lisbon+Hotel+Portugal",
};

export const HERO_SLIDES = [
  { src: heroPines, label: "Aroeira Pines Classic" },
  { src: hotelPoolReal, label: "Aroeira Lisbon Hotel" },
  { src: heroChallenge, label: "Aroeira Challenge Course" },
  { src: hotelTerraceReal, label: "Resort Pool Terrace" },
  { src: hotelRestaurantReal, label: "Hotel Restaurant" },
  { src: heroTerrace, label: "Evening Terrace" },
];

export const GALLERY_IMAGES = HERO_SLIDES;

export type Hole = {
  hole: number;
  par: number;
  si: number;
  yards: number;
  hazards: string;
  green: string;
  tip: string;
};

function buildHoles(seed: number, yardBase: number): Hole[] {
  const pars = [4, 5, 4, 3, 4, 4, 5, 3, 4, 4, 3, 5, 4, 4, 3, 4, 5, 4];
  const sis = [7, 11, 1, 15, 5, 13, 3, 17, 9, 8, 16, 12, 2, 6, 18, 10, 14, 4];
  const hazardPool = [
    "Umbrella pines tight on both sides",
    "Fairway bunkers at 240y off the tee",
    "Lake short-right of the green",
    "Deep greenside traps left",
    "Out of bounds down the right",
    "Sandy waste area at the turn",
  ];
  const greenPool = [
    "Two-tier, back pin plays a club more",
    "Subtle right-to-left fall",
    "Large and receptive, front access open",
    "Narrow, raised and well protected",
    "Domed — anything short spins off",
  ];
  const tipPool = [
    "Take one less club, the ball runs on the firm turf.",
    "Aim at the left bunker and let the slope feed it back.",
    "Lay up to 120y and take your medicine.",
    "The pines are the hazard here — 3 wood is plenty.",
    "Miss long-left, never short-right.",
  ];
  return pars.map((par, i) => ({
    hole: i + 1,
    par,
    si: sis[i]!,
    yards:
      par === 3
        ? 150 + ((i * seed) % 45)
        : par === 5
          ? 480 + ((i * seed) % 60)
          : yardBase + ((i * seed) % 90),
    hazards: hazardPool[(i + seed) % hazardPool.length]!,
    green: greenPool[(i + seed) % greenPool.length]!,
    tip: tipPool[(i + seed * 2) % tipPool.length]!,
  }));
}

export type Course = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  rating: number;
  slope: number;
  par: number;
  yardage: number;
  holes: Hole[];
  blurb: string;
};

const pinesHoles = buildHoles(3, 360);
const challengeHoles = buildHoles(5, 340);

export const COURSES: Course[] = [
  {
    id: "pines",
    name: "Aroeira Pines Classic",
    subtitle: "PGA Aroeira No. 1",
    image: heroPines,
    rating: 72.8,
    slope: 133,
    par: 72,
    yardage: pinesHoles.reduce((a, h) => a + h.yards, 0),
    holes: pinesHoles,
    blurb:
      "Frank Pennink's 1972 masterpiece. Thousands of umbrella pines frame every fairway on the course they call the Wentworth of Lisbon.",
  },
  {
    id: "challenge",
    name: "Aroeira Challenge Course",
    subtitle: "PGA Aroeira No. 2",
    image: heroChallenge,
    rating: 71.4,
    slope: 128,
    par: 72,
    yardage: challengeHoles.reduce((a, h) => a + h.yards, 0),
    holes: challengeHoles,
    blurb:
      "Donald Steel's modern layout brings water into play across nine holes. More open off the tee, far more demanding around the greens.",
  },
];

export const ROUNDS = [
  { no: 1, label: "Round 1", day: "Tuesday 1st June", courseId: "pines", tee: "14:00" },
  { no: 2, label: "Round 2", day: "Wednesday 2nd June", courseId: "challenge", tee: "10:00" },
  { no: 3, label: "Round 3", day: "Thursday 3rd June", courseId: "pines", tee: "11:00" },
] as const;

export const courseForRound = (roundNo: number) =>
  COURSES.find((c) => c.id === ROUNDS.find((r) => r.no === roundNo)?.courseId) ?? COURSES[0]!;

export type AgendaItem = {
  time?: string;
  icon: string;
  title: string;
  detail?: string;
  special?: "bidet" | "kailua";
};

export type AgendaDay = {
  id: string;
  date: string;
  title: string;
  items: AgendaItem[];
};

export const AGENDA: AgendaDay[] = [
  {
    id: "tue",
    date: "Tuesday 1st June 2027",
    title: "Arrival & Round 1",
    items: [
      { time: "06:00", icon: "plane", title: "Flight from London Heathrow to Lisbon" },
      { icon: "bus", title: "Private transfer to Aroeira Lisbon Hotel" },
      { icon: "hotel", title: "Hotel check-in" },
      { time: "14:00", icon: "flag", title: "Round 1 – PGA Aroeira No. 1" },
      { icon: "beer", title: "Post-round drinks" },
      { icon: "utensils", title: "Group dinner" },
      {
        time: "20:00",
        icon: "martini",
        title: "Kailua Fonte da Telha – sunset, cocktails, live music and beach babes",
        detail:
          "Right on the sand at Fonte da Telha, ten minutes from the resort. Get there for sunset, stay for the live band.",
        special: "kailua",
      },
      { icon: "moon", title: "Night out" },
    ],
  },
  {
    id: "wed",
    date: "Wednesday 2nd June 2027",
    title: "Round 2",
    items: [
      { icon: "coffee", title: "Breakfast" },
      { time: "10:00", icon: "flag", title: "Round 2 – PGA Aroeira No. 2" },
      { icon: "beer", title: "Drinks after golf" },
      { icon: "utensils", title: "Dinner" },
      { icon: "car", title: "Evening in Lisbon city centre for bars and nightlife" },
    ],
  },
  {
    id: "thu",
    date: "Thursday 3rd June 2027",
    title: "Final Round",
    items: [
      { icon: "coffee", title: "Breakfast" },
      {
        icon: "search",
        title: "Traditional inspection of Percy's bidet",
        detail: "A solemn ceremony. Proceed at your own risk.",
        special: "bidet",
      },
      { time: "11:00", icon: "flag", title: "Round 3 – PGA Aroeira No. 1" },
      { icon: "beer", title: "Drinks" },
      { icon: "utensils", title: "Final group dinner" },
      { icon: "moon", title: "Closing night out" },
    ],
  },
  {
    id: "fri",
    date: "Friday 4th June 2027",
    title: "Departure",
    items: [
      { icon: "coffee", title: "Breakfast" },
      { icon: "sun", title: "Free morning at the hotel" },
      { icon: "luggage", title: "Check out" },
      { icon: "bus", title: "Transfer to Lisbon Airport" },
      { time: "16:00", icon: "plane", title: "Return flight to London Heathrow" },
    ],
  },
];

export const HOTEL = {
  name: "Aroeira Lisbon Hotel",
  blurb:
    "A four-star resort hidden inside the pine forest, ten minutes from the Atlantic beaches of Costa da Caparica and twenty five from central Lisbon.",
  facilities: [
    { icon: "bed", label: "Bedrooms", detail: "Twin and double resort rooms with balconies over the pines" },
    { icon: "waves", label: "Pool", detail: "Outdoor pool and sun terrace" },
    { icon: "utensils", label: "Restaurant", detail: "Portuguese à la carte plus buffet breakfast" },
    { icon: "martini", label: "Bar", detail: "Clubhouse bar with 19th-hole terrace" },
    { icon: "flower", label: "Spa", detail: "Indoor pool, sauna and treatment rooms" },
    { icon: "dumbbell", label: "Gym", detail: "24 hour fitness suite" },
  ],
  images: [hotelPoolReal, hotelTerraceReal, hotelRestaurantReal, heroClubhouse],
};
