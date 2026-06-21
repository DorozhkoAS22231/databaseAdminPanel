import { useEffect, useState } from "react";

import { DEFAULT_VISIBILITY } from "../config/defaultVisibility";

export function useColumnVisibility() {
  const [visibility, setVisibility] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "column-visibility"
        );

      if (saved) {
        return JSON.parse(saved);
      }

      return DEFAULT_VISIBILITY;
    });

  useEffect(() => {
    localStorage.setItem(
      "column-visibility",
      JSON.stringify(visibility)
    );
  }, [visibility]);

  return {
    visibility,
    setVisibility
  };
}