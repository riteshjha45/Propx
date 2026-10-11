/*
  PROPX PROPERTY DATA
  Add, edit or remove property objects in this array.
  Put your photos inside assets/images/ and use their relative paths.
  purpose must be "rent" or "sale".
  type must be "Land", "Flat", "House" or "Room".
*/
const PROPERTIES = [
  {
    id: 1,
    title: "Modern 2BHK Apartment",
    type: "Flat",
    purpose: "rent",
    location: "New Town, Kolkata",
    price: 18000,
    area: "950 sq ft",
    beds: 2,
    baths: 2,
    description: "A bright apartment with a balcony in a well-connected neighbourhood.",
    details: "Add the complete property description, nearby landmarks, facilities and availability here.",
    amenities: ["Balcony", "Parking", "Lift"],
    images: ["assets/images/property-1.jpg"],
    phone: "919876543210"
  },
  {
    id: 2,
    title: "Residential Plot",
    type: "Land",
    purpose: "sale",
    location: "Rajarhat, Kolkata",
    price: 4200000,
    area: "2400 sq ft",
    beds: 0,
    baths: 0,
    description: "Residential plot with convenient access to the main road.",
    details: "Add plot dimensions, road width, ownership information and other verified details here.",
    amenities: ["Road access"],
    images: ["assets/images/property-2.jpg"],
    phone: "919876543210"
  },
  {
    id: 3,
    title: "Private Room for Rent",
    type: "Room",
    purpose: "rent",
    location: "Jadavpur, Kolkata",
    price: 7000,
    area: "180 sq ft",
    beds: 1,
    baths: 1,
    description: "A compact room suitable for a student or working professional.",
    details: "Add furnishing, deposit, utilities, house rules and availability details here.",
    amenities: ["Furnished"],
    images: ["assets/images/property-3.jpg"],
    phone: "919876543210"
  }
];
