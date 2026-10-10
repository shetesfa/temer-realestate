/**
 * TEMER Real Estate - Centralized Properties Data (Informational Showcase)
 * Brand: TEMER Real Estate | Addis Ababa, Ethiopia
 * Primary Contact: +251 94 124 6658
 */

const TEMER_PROPERTIES = [
  {
    id: "temer-tower-bole-01",
    title: "TEMER Luxury Tower — 3-Bedroom Sky Residence",
    location: "Bole",
    city: "Addis Ababa",
    subcity: "Bole Sub-City, Near Atlas",
    area: 168, // m²
    bedrooms: 3,
    bathrooms: 3,
    propertyType: "Apartment",
    status: "Available",
    badge: "Featured Delivery",
    isDemonstration: false,
    verifiedProject: "TEMER Premier Tower",
    image: "../assets/images/photo_2026-10-09_10-14-17.jpg",
    gallery: [
      "../assets/images/photo_2026-10-09_10-14-17.jpg",
      "../assets/images/posters/poster_video1.jpg",
      "../assets/images/posters/poster_video2.jpg"
    ],
    video: "../assets/videos/IMG_9335.MP4",
    floorLevel: "14th Floor",
    parkingSpaces: 2,
    completionStatus: "Ready for Handover",
    description: "Experience sophisticated urban living in this expansive 3-bedroom residence within TEMER's landmark residential tower. Designed with contemporary aesthetics, private panoramic balconies, high-speed elevator access, and integrated backup utilities.",
    features: [
      "Panoramic Balconies with Addis Skyline Views",
      "Dual Dedicated Underground Parking",
      "High-Capacity Backup Generator & Water Reserve",
      "24/7 Monitored Security & CCTV Surveillance",
      "Double-Glazed Soundproof Architectural Glazing",
      "Modern Open-Concept Fitted Kitchen",
      "High-Speed Automatic Elevators",
      "Ground-Level Commercial & Banking Access"
    ],
    highlights: [
      "Immediate Handover & Legal Title Transfer Readiness",
      "Dedicated On-Site Architecture & Engineering Support",
      "Comprehensive Property Management & Resident Concierge"
    ],
    coordinates: { lat: 9.0082, lng: 38.7845 },
    contact: {
      phone: "+251 94 124 6658",
      whatsappNumber: "251941246658",
      email: "info@temerrealestate.com"
    }
  },
  {
    id: "temer-tower-bole-02",
    title: "TEMER Landmark Tower — 2-Bedroom Executive Suite",
    location: "Bole",
    city: "Addis Ababa",
    subcity: "Bole Sub-City, Medhanialem Corridor",
    area: 122,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Apartment",
    status: "Available",
    badge: "Prime Location",
    isDemonstration: false,
    verifiedProject: "TEMER Residential Tower",
    image: "../assets/images/posters/poster_video1.jpg",
    gallery: [
      "../assets/images/posters/poster_video1.jpg",
      "../assets/images/photo_2026-10-09_10-14-17.jpg",
      "../assets/images/posters/poster_video3.jpg"
    ],
    video: "../assets/videos/IMG_9306.MOV",
    floorLevel: "9th Floor",
    parkingSpaces: 1,
    completionStatus: "Delivered & Ready",
    description: "An elegant 2-bedroom home combining comfort, security, and prime accessibility. Ideal for residents seeking immediate occupancy in the heart of Bole.",
    features: [
      "Spacious Master Suite with Walk-In Closet",
      "Floor-to-Ceiling Windows with Natural Daylight",
      "Secure Gated Access & Concierge Desk",
      "Centralized Satellite TV & High-Speed Fiber",
      "Fire Safety Sprinklers & Smoke Alarms",
      "Garbage Chute on Every Floor"
    ],
    highlights: [
      "Prime Urban Access to Addis International Hub",
      "High Finishing Quality & Premium Fixtures",
      "Full Utility Redundancy (Generator & Water)"
    ],
    coordinates: { lat: 8.9950, lng: 38.7880 },
    contact: {
      phone: "+251 94 124 6658",
      whatsappNumber: "251941246658",
      email: "info@temerrealestate.com"
    }
  },
  {
    id: "temer-penthouse-crown",
    title: "TEMER Signature Sky Penthouse — 4-Bedroom Duplex",
    location: "Bole",
    city: "Addis Ababa",
    subcity: "Bole Sub-City, Atlas",
    area: 285,
    bedrooms: 4,
    bathrooms: 4.5,
    propertyType: "Penthouse",
    status: "Available",
    badge: "Flagship Luxury",
    isDemonstration: false,
    verifiedProject: "TEMER Premier Tower",
    image: "../assets/images/posters/poster_video2.jpg",
    gallery: [
      "../assets/images/posters/poster_video2.jpg",
      "../assets/images/photo_2026-10-09_10-14-17.jpg",
      "../assets/images/posters/poster_video4.jpg"
    ],
    video: "../assets/videos/IMG_9374.MOV",
    floorLevel: "Top Penthouse Floors (16 & 17)",
    parkingSpaces: 3,
    completionStatus: "Executive Finishing",
    description: "Crown jewel of TEMER Real Estate. A sprawling duplex penthouse with private rooftop terrace, double-height ceilings, maid's quarters, and unhindered 360-degree vistas of the Ethiopian capital.",
    features: [
      "Private 65 m² Rooftop Sky Terrace & BBQ Deck",
      "Double-Height Living Salon with Glass Curtain Wall",
      "Master Sanctuary with Spa Bath & Dressing Room",
      "Dedicated Service Elevator & Maids En-Suite",
      "Triple Secured Underground Parking Bays",
      "Smart Home Automation Pre-Wired"
    ],
    highlights: [
      "Bespoke Architectural Finishing & Premium Natural Stone",
      "Private Skyline Viewing Deck & High-Floor Privacy",
      "VIP Concierge & Direct Dedicated Elevator Service"
    ],
    coordinates: { lat: 9.0082, lng: 38.7845 },
    contact: {
      phone: "+251 94 124 6658",
      whatsappNumber: "251941246658",
      email: "info@temerrealestate.com"
    }
  },
  {
    id: "temer-kazanchis-01",
    title: "TEMER Central Residence — 2-Bedroom Diplomatic Quarter",
    location: "Kazanchis",
    city: "Addis Ababa",
    subcity: "Kirkos Sub-City, Kazanchis UN Area",
    area: 135,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Apartment",
    status: "Available",
    badge: "Diplomatic Quarter",
    isDemonstration: false,
    verifiedProject: "TEMER Kazanchis Heights",
    image: "../assets/images/photo_2026-10-09_10-14-17.jpg",
    gallery: [
      "../assets/images/photo_2026-10-09_10-14-17.jpg",
      "../assets/images/posters/poster_video3.jpg"
    ],
    video: "../assets/videos/IMG_9414.MOV",
    floorLevel: "7th Floor",
    parkingSpaces: 1,
    completionStatus: "Under Construction (85% Completed)",
    description: "Located within the premier diplomatic and international institutional corridor of Kazanchis, minutes away from the UNECA and top international hotels. Unmatched residential accessibility.",
    features: [
      "Walking Distance to UNECA and International Centers",
      "Modern Engineered Sound Insulation",
      "Full Electricity Generator & Deep Borehole Water Supply",
      "Controlled Card Access Entry Points"
    ],
    highlights: [
      "Direct Proximity to Diplomatic & International Institutions",
      "Engineered Structural Integrity & Modern Acoustic Comfort",
      "Verified Milestone Delivery Schedule"
    ],
    coordinates: { lat: 9.0180, lng: 38.7690 },
    contact: {
      phone: "+251 94 124 6658",
      whatsappNumber: "251941246658",
      email: "info@temerrealestate.com"
    }
  },
  {
    id: "temer-sarbet-01",
    title: "TEMER Heights Sarbet — 3-Bedroom Family Residence",
    location: "Sarbet",
    city: "Addis Ababa",
    subcity: "Nifas Silk-Lafto, Near AU HQ",
    area: 175,
    bedrooms: 3,
    bathrooms: 3,
    propertyType: "Apartment",
    status: "Under Construction",
    badge: "New Phase Launch",
    isDemonstration: false,
    verifiedProject: "TEMER Sarbet Development",
    image: "../assets/images/posters/poster_video3.jpg",
    gallery: [
      "../assets/images/posters/poster_video3.jpg",
      "../assets/images/photo_2026-10-09_10-14-17.jpg"
    ],
    video: "../assets/videos/IMG_9335.MP4",
    floorLevel: "11th Floor",
    parkingSpaces: 2,
    completionStatus: "Under Construction",
    description: "Quiet residential sanctuary in affluent Sarbet, close to the African Union headquarters and top international schools. Designed with expansive living areas and family functionality.",
    features: [
      "Proximity to International Community Schools & AU",
      "Landscaped Children's Play Yard and Garden",
      "Dual Balconies with Green Hill Views",
      "Dedicated Storage Unit in Basement"
    ],
    highlights: [
      "Family-Centered Neighborhood Design & Safe Grounds",
      "Scenic Green Hill Panoramas with Dual Balconies",
      "Underground Parking & Separate Secure Storage"
    ],
    coordinates: { lat: 8.9920, lng: 38.7360 },
    contact: {
      phone: "+251 94 124 6658",
      whatsappNumber: "251941246658",
      email: "info@temerrealestate.com"
    }
  },
  {
    id: "temer-cmc-01",
    title: "TEMER Garden View — 2-Bedroom Modern Apartment",
    location: "CMC",
    city: "Addis Ababa",
    subcity: "Yeka Sub-City, CMC Corridor",
    area: 108,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Apartment",
    status: "Available",
    badge: "Modern Living",
    isDemonstration: false,
    verifiedProject: "TEMER CMC Residences",
    image: "../assets/images/posters/poster_video4.jpg",
    gallery: [
      "../assets/images/posters/poster_video4.jpg",
      "../assets/images/photo_2026-10-09_10-14-17.jpg"
    ],
    video: "../assets/videos/IMG_9306.MOV",
    floorLevel: "5th Floor",
    parkingSpaces: 1,
    completionStatus: "Ready for Delivery",
    description: "Quality living in the fast-growing CMC residential corridor. Offers tranquility away from central traffic with immediate access to Light Rail and major arterial highways.",
    features: [
      "Close to Light Rail Station & Shopping Malls",
      "Low Density Residential Community",
      "Reliable Water Tank Reservoir & Generator Backup",
      "Well-Lit Secure Common Spaces"
    ],
    highlights: [
      "Peaceful Residential Setting with Arterial Highway Link",
      "Ready for Immediate Move-In and Inspection",
      "Continuous Water & Energy Resilience"
    ],
    coordinates: { lat: 9.0230, lng: 38.8350 },
    contact: {
      phone: "+251 94 124 6658",
      whatsappNumber: "251941246658",
      email: "info@temerrealestate.com"
    }
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TEMER_PROPERTIES };
}
