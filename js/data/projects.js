/**
 * TEMER Real Estate - Projects Portfolio Data
 * Brand: TEMER Real Estate | Addis Ababa, Ethiopia
 * Verified Record: Founded 2010 EC | >350 Apartment Units Delivered
 */

const TEMER_PROJECTS = [
  {
    id: "temer-premier-tower",
    name: "TEMER Premier Tower",
    location: "Bole, Addis Ababa",
    status: "Delivered & Occupied",
    category: "Residential & Commercial Podium",
    totalUnits: 140,
    deliveredYear: "2015 E.C.",
    floors: 17,
    image: "../assets/images/photo_2026-10-09_10-14-17.jpg",
    video: "../assets/videos/IMG_9335.MP4",
    highlights: [
      "Signature high-rise landmark with distinctive TEMER crown",
      "Over 140 modern 2-bedroom, 3-bedroom, and penthouse units",
      "Double-height commercial ground & mezzanine bank/retail levels",
      "Integrated 24/7 standby generators & dual-chamber water storage"
    ],
    description: "TEMER Premier Tower stands as an iconic testament to TEMER Real Estate's commitment to quality delivery in Bole, Addis Ababa. Delivered on schedule with full occupancy, it showcases precision engineering, generous living layouts, and prime urban connectivity."
  },
  {
    id: "temer-kazanchis-heights",
    name: "TEMER Kazanchis Heights",
    location: "Kazanchis (UN Corridor), Addis Ababa",
    status: "Under Construction",
    category: "Luxury Residential Tower",
    totalUnits: 110,
    deliveredYear: "Target 2018 E.C.",
    floors: 19,
    image: "../assets/images/posters/poster_video1.jpg",
    video: "../assets/videos/IMG_9306.MOV",
    highlights: [
      "Strategic diplomatic corridor near UNECA and major luxury hotels",
      "High rental yield targeting expatriate and international professionals",
      "Sound-insulating facade and double-glazed acoustic windows",
      "Three levels of secured subterranean parking"
    ],
    description: "Situated in the bustling diplomatic heart of Addis Ababa, TEMER Kazanchis Heights is engineered to international hospitality standards, featuring executive suites, panoramic sky balconies, and top-tier security infrastructure."
  },
  {
    id: "temer-sarbet-residences",
    name: "TEMER Sarbet Green Residences",
    location: "Sarbet, Near African Union, Addis Ababa",
    status: "Under Construction",
    category: "Family Urban Residences",
    totalUnits: 95,
    deliveredYear: "Target 2018 E.C.",
    floors: 14,
    image: "../assets/images/posters/poster_video3.jpg",
    video: "../assets/videos/IMG_9374.MOV",
    highlights: [
      "Serene neighborhood close to AU Headquarters and international schools",
      "Expansive floor plans tailored for family comfort and privacy",
      "Private courtyard, landscaped garden walkway, and children's playground",
      "Eco-conscious lighting and solar-assisted water heating"
    ],
    description: "An oasis of calm within the diplomatic hub of Sarbet. TEMER Sarbet Residences emphasizes tranquility, family-friendly recreation spaces, and generous natural daylight across every floor."
  },
  {
    id: "temer-cmc-gardens",
    name: "TEMER CMC Gardens",
    location: "CMC Corridor, Addis Ababa",
    status: "Delivered & Handed Over",
    category: "Modern Residential Community",
    totalUnits: 120,
    deliveredYear: "2013 E.C.",
    floors: 12,
    image: "../assets/images/posters/poster_video4.jpg",
    video: "../assets/videos/IMG_9414.MOV",
    highlights: [
      "Successfully delivered and handed over to homeowners",
      "Over 120 family homes with dedicated underground parking",
      "Walking distance to commercial boulevards and public transit",
      "Continuous building management and maintenance services"
    ],
    description: "One of TEMER's proudest delivery milestones, contributing to the >350 homes delivered across the capital. CMC Gardens represents reliable community living with long-term asset value."
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TEMER_PROJECTS };
}
