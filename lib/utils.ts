import { FilterProps } from "@/app/types";
import { clsx, type ClassValue } from "clsx";
import qs from "qs";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const safeFetch = async <T>(
  fn: () => Promise<T>,
  context: string
): Promise<T | null> => {
  try {
    return await fn();
  } catch (error) {
    console.error(`[${context}]`, error);
    return null;
  }
};

export const buildFilterQuery = (props: FilterProps) => {
  const { filters, offset, limit, sortBy, sortOrder } = props;
  const queryString = qs.stringify(
    {
      filters,
      offset,
      limit,
      sort_by: sortBy,
      sort_order: sortOrder,
      // uid,
    },
    {
      arrayFormat: "indices",
      encode: true,
      // depth: 4
    }
  );
  return queryString;
};
