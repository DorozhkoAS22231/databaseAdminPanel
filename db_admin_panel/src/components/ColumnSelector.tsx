import { useState } from "react";

import { COLUMN_LABELS } from "../config/columns";

interface Props {
  entity: string;

  visibility: Record<
    string,
    Record<string, boolean>
  >;

  setVisibility: React.Dispatch<
    React.SetStateAction<any>
  >;
}

export default function ColumnSelector({
  entity,
  visibility,
  setVisibility
}: Props) {
  const [open, setOpen] =
    useState(false);

  const columns =
    visibility[entity];


  if (!columns) {
    return null;
  }

  const labels =
    COLUMN_LABELS[
      entity as keyof typeof COLUMN_LABELS
    ] as Record<
      string,
      string
    >;

  return (
    <div
      style={{
        marginBottom: 20
      }}
    >
      <button
        onClick={() =>
          setOpen(
            prev => !prev
          )
        }
        style={{
          marginBottom: 10
        }}
      >
        {open
          ? "▼ Скрыть колонки"
          : "▶ Настроить колонки"}
      </button>

      {open && (
        <div
          style={{
            border:
              "1px solid #ddd",
            padding: 10,
            borderRadius: 6
          }}
        >
          {Object.entries(
            columns
          ).map(
            ([
              column,
              visible
            ]) => (
              <label
                key={column}
                style={{
                  display:
                    "block",
                  marginBottom: 6
                }}
              >
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={() =>
                    setVisibility(
                      (
                        prev: any
                      ) => ({
                        ...prev,

                        [entity]:
                          {
                            ...prev[
                              entity
                            ],

                            [column]:
                              !visible
                          }
                      })
                    )
                  }
                />

                {" "}

                {labels?.[
                  column
                ] ??
                  column}
              </label>
            )
          )}
        </div>
      )}
    </div>
  );
}