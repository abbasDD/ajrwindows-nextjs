import {
  Square,
  Circle,
  Triangle,
  Minus,
  Image,
  PenTool,
  MousePointer2,
  Type,
  Trash2,
  RotateCcw,
  MessageSquare,
  ArrowUpToLine,
  ArrowDownToLine,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  AlignEndVertical,
  DoorOpen,
  LayoutGrid,
  Glasses,
  GlassesIcon,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

export const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

export const shapeElements = [
  {
    Icon: Square,
    name: "Rectangle",
    value: "rectangle",
  },
  {
    Icon: Circle,
    name: "Circle",
    value: "circle",
  },
  {
    Icon: Triangle,
    name: "Triangle",
    value: "triangle",
  },
  {
    Icon: Minus,
    name: "Line",
    value: "line",
  },
  {
    Icon: Image,
    name: "Image",
    value: "image",
  },
  {
    Icon: PenTool,
    name: "Free Drawing",
    value: "freeform",
  },
];
export const doorElements = [
  { name: "Single Door", value: "single", Icon: DoorOpen },
  { name: "Double Door", value: "double", Icon: DoorOpen },
  { name: "Single Arched", value: "single-arched", Icon: DoorOpen },
  { name: "Transom", value: "transom", Icon: DoorOpen },
];
export const glassElements = [
  { name: "Glass 1", value: "glass1", Icon: GlassesIcon },
  { name: "Glass 2", value: "glass2", Icon: GlassesIcon },
];

export const windowElements = [
  { name: "Standard", value: "standard-window", Icon: LayoutGrid },
  { name: "Double Hung", value: "double-hung", Icon: LayoutGrid },
  { name: "Picture", value: "picture-window", Icon: LayoutGrid },
];
export const navElements = [
  {
    Icon: MousePointer2,
    name: "Select",
    value: "select",
  },
  {
    Icon: Glasses,
    name: "Glasses",
    value: glassElements,
  },
  {
    Icon: DoorOpen,
    name: "Doors",
    value: doorElements,
  },
  {
    Icon: LayoutGrid,
    name: "Windows",
    value: windowElements,
  },
  {
    Icon: Square,
    name: "Rectangle",
    value: shapeElements,
  },
  {
    Icon: Type,
    value: "text",
    name: "Text",
  },
  {
    Icon: Trash2,
    value: "delete",
    name: "Delete",
  },
  {
    Icon: RotateCcw,
    value: "reset",
    name: "Reset",
  },
  {
    Icon: MessageSquare,
    value: "comments",
    name: "Comments",
  },
];

export const defaultNavElement = {
  Icon: MousePointer2,
  name: "Select",
  value: "select",
};

export const directionOptions = [
  {
    label: "Bring to Front",
    value: "front",
    Icon: ArrowUpToLine,
  },
  {
    label: "Send to Back",
    value: "back",
    Icon: ArrowDownToLine,
  },
];

export const fontFamilyOptions = [
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Comic Sans MS", label: "Comic Sans MS" },
  { value: "Brush Script MT", label: "Brush Script MT" },
];

export const fontSizeOptions = [
  { value: "10", label: "10" },
  { value: "12", label: "12" },
  { value: "14", label: "14" },
  { value: "16", label: "16" },
  { value: "18", label: "18" },
  { value: "20", label: "20" },
  { value: "22", label: "22" },
  { value: "24", label: "24" },
  { value: "26", label: "26" },
  { value: "28", label: "28" },
  { value: "30", label: "30" },
  { value: "32", label: "32" },
  { value: "34", label: "34" },
  { value: "36", label: "36" },
];

export const fontWeightOptions = [
  { value: "400", label: "Normal" },
  { value: "500", label: "Semibold" },
  { value: "600", label: "Bold" },
];

export const alignmentOptions = [
  {
    value: "left",
    label: "Align Left",
    Icon: AlignLeft,
  },
  {
    value: "horizontalCenter",
    label: "Align Horizontal Center",
    Icon: AlignHorizontalJustifyCenter,
  },
  {
    value: "right",
    label: "Align Right",
    Icon: AlignRight,
  },
  {
    value: "top",
    label: "Align Top",
    Icon: AlignEndVertical,
  },
  {
    value: "verticalCenter",
    label: "Align Vertical Center",
    Icon: AlignVerticalJustifyCenter,
  },
  {
    value: "bottom",
    label: "Align Bottom",
    Icon: AlignEndVertical,
  },
];

export const shortcuts = [
  {
    key: "1",
    name: "Chat",
    shortcut: "/",
  },
  {
    key: "2",
    name: "Undo",
    shortcut: "⌘ + Z",
  },
  {
    key: "3",
    name: "Redo",
    shortcut: "⌘ + Y",
  },
  {
    key: "4",
    name: "Reactions",
    shortcut: "E",
  },
];

// TypeScript types for better type safety
export type ShapeElement = {
  Icon: LucideIcon;
  name: string;
  value: string;
};

export type NavElement = {
  Icon: LucideIcon;
  name: string;
  value: string | ShapeElement[];
};

export type DirectionOption = {
  label: string;
  value: string;
  Icon: LucideIcon;
};

export type AlignmentOption = {
  value: string;
  label: string;
  Icon: LucideIcon;
};
