import { mapToURL } from "@/app/api/helpers";
import { URLResponse } from "@/app/api/types";

export const parseDisplayName = (displayName: string | null) => {
    if (!displayName) return { firstName: '', lastName: '' };
    
    const nameParts = displayName.split(' ');
    return {
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || ''
    };
  };

  export const urlMapToArray = (
    urlMap: Map<number, URLResponse>,
    length: number
  ) => {
    return Array.from({ length: length })
      .map((_, i) => {
        return urlMap.get(i);
      })
      .filter((u) => u != undefined)
      .map((url) => mapToURL(url));
  };