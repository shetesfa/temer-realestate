/**
 * TEMER Real Estate - Addis Ababa Prime Locations Data
 * Strategic investment corridors across Ethiopia's diplomatic capital
 */

const TEMER_LOCATIONS = [
  {
    id: "bole",
    name: "Bole",
    amharicName: "ቦሌ",
    tagline: "The Pulse of Modern Addis Ababa",
    description: "Bole is Addis Ababa's premier lifestyle, commercial, and diplomatic artery. Anchored by Bole International Airport, luxury dining, upscale shopping, and top corporate headquarters, properties in Bole command the highest rental yields and capital appreciation in Ethiopia.",
    image: "../assets/images/photo_2026-10-09_10-14-17.jpg",
    landmarks: [
      "Bole International Airport (5-10 mins)",
      "Medhanialem Cathedral & Mall",
      "Atlas Entertainment & Culinary Corridor",
      "International Luxury Hotels (Skylight, Hyatt Regency)"
    ],
    investmentRating: "5 / 5 Stars — Premium High Yield",
    rentalYield: "10% – 14% Annualized in Foreign Currency",
    activeProjects: ["TEMER Premier Tower", "TEMER Bole Executive"],
    propertiesCount: 8
  },
  {
    id: "kazanchis",
    name: "Kazanchis",
    amharicName: "ካዛንቺስ",
    tagline: "Diplomatic Core & Institutional Hub",
    description: "Home to the United Nations Economic Commission for Africa (UNECA) and surrounded by world-class hotels, Kazanchis is the preferred residential base for expatriates, diplomats, and international consultants.",
    image: "../assets/images/posters/poster_video1.jpg",
    landmarks: [
      "UN Economic Commission for Africa (UNECA)",
      "Interluxury & Radisson Blu Hotels",
      "Menelik II Palace & Unity Park",
      "Central Government & Financial Headquarters"
    ],
    investmentRating: "5 / 5 Stars — High Expat Demand",
    rentalYield: "12% – 15% Annualized",
    activeProjects: ["TEMER Kazanchis Heights"],
    propertiesCount: 4
  },
  {
    id: "sarbet",
    name: "Sarbet & Old Airport",
    amharicName: "ሳር ቤት",
    tagline: "Prestigious Living Near the African Union",
    description: "Nestled between the African Union Headquarters and Old Airport, Sarbet offers mature greenery, calm residential avenues, prestigious international schools, and premier leisure facilities.",
    image: "../assets/images/posters/poster_video3.jpg",
    landmarks: [
      "African Union Headquarters",
      "International Community School (ICS)",
      "South Africa & European Embassies",
      "Bisrate Gabriel Commercial Center"
    ],
    investmentRating: "4.8 / 5 Stars — Long-Term Family Wealth",
    rentalYield: "9% – 12% Annualized",
    activeProjects: ["TEMER Sarbet Green Residences"],
    propertiesCount: 5
  },
  {
    id: "cmc",
    name: "CMC Corridor",
    amharicName: "ሲኤምሲ",
    tagline: "Master-Planned Suburban Comfort",
    description: "A masterfully developed residential enclave known for wide boulevards, family-friendly security, modern convenience shopping, and rapid transit connectivity to downtown via the Light Rail.",
    image: "../assets/images/posters/poster_video4.jpg",
    landmarks: [
      "Addis Light Rail Transit Line",
      "Civil Service University & Safari Academy",
      "CMC Commercial Boulevards & Supermarkets",
      "Gurd Shola Business District"
    ],
    investmentRating: "4.7 / 5 Stars — High Capital Growth",
    rentalYield: "8% – 11% Annualized",
    activeProjects: ["TEMER CMC Gardens"],
    propertiesCount: 6
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TEMER_LOCATIONS };
}
