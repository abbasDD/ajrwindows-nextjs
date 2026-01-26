import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { Buckets } from "@/constant/constant";

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
