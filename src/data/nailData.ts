import nailAcrylic from "@/assets/nail-acrylic.jpg";
import nailGel from "@/assets/nail-gel.jpg";
import nailArt from "@/assets/nail-art.jpg";
import nailFrench from "@/assets/nail-french.jpg";
import nailCustom from "@/assets/nail-custom.jpg";

export interface NailDesign {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
}

export const nailDesigns: NailDesign[] = [
  {
    id: "1",
    name: "Rose Quartz Acrylic",
    category: "Acrylic Nails",
    description: "Elegant soft pink acrylic nails with subtle glitter accents",
    price: 1200,
    image: nailAcrylic,
  },
  {
    id: "2",
    name: "Nude Blush Gel",
    category: "Gel Nails",
    description: "Glossy nude and blush gel polish for a natural luxe look",
    price: 900,
    image: nailGel,
  },
  {
    id: "3",
    name: "Floral Garden Art",
    category: "Nail Art",
    description: "Hand-painted floral patterns with delicate botanical details",
    price: 1500,
    image: nailArt,
  },
  {
    id: "4",
    name: "Classic French Tips",
    category: "French Tips",
    description: "Timeless white tips on a natural pink base, clean and elegant",
    price: 800,
    image: nailFrench,
  },
  {
    id: "5",
    name: "Crystal Dream Custom",
    category: "Custom Designs",
    description: "Bespoke nail design with crystals, chrome, and custom art",
    price: 2000,
    image: nailCustom,
  },
  {
    id: "6",
    name: "Lavender Ombré Acrylic",
    category: "Acrylic Nails",
    description: "Soft lavender to white gradient with a matte finish",
    price: 1300,
    image: nailAcrylic,
  },
  {
    id: "7",
    name: "Peach Glow Gel",
    category: "Gel Nails",
    description: "Warm peach-toned gel with a high-shine glossy finish",
    price: 950,
    image: nailGel,
  },
  {
    id: "8",
    name: "Butterfly Wings Art",
    category: "Nail Art",
    description: "Whimsical butterfly wing design in pastel watercolors",
    price: 1600,
    image: nailArt,
  },
];

export const serviceCategories = [
  "All",
  "Acrylic Nails",
  "Gel Nails",
  "Nail Art",
  "French Tips",
  "Custom Designs",
];

export const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM",
];
