import { twMerge } from "tailwind-merge";
import { type ClassValue, clsx } from "clsx";
import { type QueryClient } from "@tanstack/react-query";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const dayInMS = 1000 * 60 * 60 * 24;

export const getFromCache = (key: string, queryClient: QueryClient) => {
  return queryClient.getQueryData([key]);
};
