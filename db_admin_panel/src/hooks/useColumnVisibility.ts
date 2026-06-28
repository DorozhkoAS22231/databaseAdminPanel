import { useEffect, useState } from "react";

import { DEFAULT_VISIBILITY } from "../config/defaultVisibility";

export function useColumnVisibility() {
  const [visibility, setVisibility] =
    useState(() => {
      const saved =
        localStorage.getItem(
          "column-visibility"
        );

      if (!saved) {
        return DEFAULT_VISIBILITY;
      }

      const parsed =
        JSON.parse(saved);

      const merged: any = {};

Object.keys(
  DEFAULT_VISIBILITY
).forEach(entity => {
  merged[entity] = {};

  const defaults =
    DEFAULT_VISIBILITY[
      entity as keyof typeof DEFAULT_VISIBILITY
    ];

  Object.keys(
    defaults
  ).forEach(column => {
    merged[entity][
      column
    ] =
      parsed?.[
        entity
      ]?.[
        column
      ] ??
      defaults[
        column as keyof typeof defaults
      ];
  });
});

return merged;

    });

  useEffect(() => {
    localStorage.setItem(
      "column-visibility",
      JSON.stringify(
        visibility
      )
    );
  }, [visibility]);

  return {
    visibility,
    setVisibility
  };
}