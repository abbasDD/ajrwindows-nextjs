import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { Buckets } from "@/constant/constant";
import jsPDF from "jspdf";
import {
  Square,
  Circle,
  Triangle,
  Minus,
  Image,
  PenTool,
  Type,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// time stamps to date using date-fns
export function formatTimestamp(
  timestamp: Date | string,
  dateFormat: string = "yyyy-MM-dd",
) {
  console.log(typeof timestamp);
  if (!timestamp) return "";
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  return format(date, dateFormat);
}
export function generateSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
export function getPathFromPublicUrl(
  url: string,
  bucket: (typeof Buckets)[keyof typeof Buckets],
) {
  const u = new URL(url);
  const prefix = `/storage/v1/object/public/${bucket}/`;
  if (!u.pathname.startsWith(prefix)) throw new Error("Invalid file URL");
  return u.pathname.replace(prefix, "");
}
// get initlal first two strings from username
export function getInitials(username: string) {
  if (!username) return "";
  const initials = username
    ?.split(" ")
    ?.map((name) => name.charAt(0))
    ?.join("");
  return initials;
}

// CANVAS

const adjectives = [
  "Happy",
  "Creative",
  "Energetic",
  "Lively",
  "Dynamic",
  "Radiant",
  "Joyful",
  "Vibrant",
  "Cheerful",
  "Sunny",
  "Sparkling",
  "Bright",
  "Shining",
];

const animals = [
  "Dolphin",
  "Tiger",
  "Elephant",
  "Penguin",
  "Kangaroo",
  "Panther",
  "Lion",
  "Cheetah",
  "Giraffe",
  "Hippopotamus",
  "Monkey",
  "Panda",
  "Crocodile",
];

export function generateRandomName(): string {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)];

  return `${randomAdjective} ${randomAnimal}`;
}

export const getShapeInfo = (
  shapeType: string,
): { Icon: LucideIcon; name: string } => {
  switch (shapeType) {
    case "rect":
      return {
        Icon: Square,
        name: "Rectangle",
      };
    case "circle":
      return {
        Icon: Circle,
        name: "Circle",
      };
    case "triangle":
      return {
        Icon: Triangle,
        name: "Triangle",
      };
    case "line":
      return {
        Icon: Minus,
        name: "Line",
      };
    case "i-text":
      return {
        Icon: Type,
        name: "Text",
      };
    case "image":
      return {
        Icon: Image,
        name: "Image",
      };
    case "freeform":
      return {
        Icon: PenTool,
        name: "Free Drawing",
      };
    default:
      return {
        Icon: Square,
        name: shapeType,
      };
  }
};

export const exportToPdf = () => {
  const canvas = document.querySelector("canvas");

  if (!canvas) return;

  // use jspdf
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  // get the canvas data url
  const data = canvas.toDataURL();

  // add the image to the pdf
  doc.addImage(data, "PNG", 0, 0, canvas.width, canvas.height);

  // download the pdf
  doc.save("canvas.pdf");
};
export const getCanvasImageUrl = (designId: string): string | null => {
  const cachedImage = localStorage.getItem(designId);
  if (cachedImage) {
    return cachedImage;
  }
  const canvas = document.querySelector("canvas");
  if (!canvas) return null;
  const dataUrl = canvas.toDataURL("image/png", 0.7);

  try {
    localStorage.setItem(designId, dataUrl);
    const history = JSON.parse(localStorage.getItem("canvas_history") || "[]");
    if (!history.includes(designId)) {
      localStorage.setItem(
        "canvas_history",
        JSON.stringify([designId, ...history].slice(0, 10)),
      );
    }

    return dataUrl;
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
    return dataUrl;
  }
};
export const generateDesignId = async (shapes: any[]): Promise<string> => {
  if (!shapes || shapes.length === 0) return "empty-design";
  const msgUint8 = new TextEncoder().encode(JSON.stringify(shapes));
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const uuidFormat = [
    hashHex.substring(0, 8),
    hashHex.substring(8, 12),
    hashHex.substring(12, 16),
    hashHex.substring(16, 20),
    hashHex.substring(20, 32),
  ].join("-");

  return uuidFormat;
};
