import { useEffect, useState } from "react";

import { COLUMN_LABELS } from "../config/columns";

interface Props {
  entity?: string;

  open: boolean;

  row: Record<
    string,
    unknown
  > | null;

  onClose: () => void;

  onSave: (
    values: Record<
      string,
      unknown
    >
  ) => void;
}

export default function EditModal({
  entity,
  open,
  row,
  onClose,
  onSave
}: Props) {
  const [values,
    setValues] =
    useState<
      Record<
        string,
        unknown
      >
    >({});

  useEffect(() => {
    if (row) {
      setValues(row);
    }
  }, [row]);

  if (
    !open ||
    !row
  ) {
    return null;
  }

  const labels =
    entity
      ? (
          COLUMN_LABELS[
            entity as keyof typeof COLUMN_LABELS
          ] as Record<
            string,
            string
          >
        )
      : {};

  const hiddenFields = [
  "id",

  "sport_id",
  "teacher_id",
  "group_id",

  "sport_name",
  "teacher_fio"
];

if (
  entity === "athletes"
) {
  hiddenFields.push(
    "group_name"
  );
}
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,.3)",
        display: "flex",
        justifyContent:
          "center",
        alignItems:
          "center",
        zIndex: 9999
      }}
    >
      <div
        style={{
          background:
            "white",
          padding: 20,
          width: 600,
          maxHeight:
            "80vh",
          overflow: "auto",
          borderRadius: 8
        }}
      >
        <h2>
          Редактирование
        </h2>

        {Object.entries(
          values
        ).map(
          ([field, value]) => {
            if (
              hiddenFields.includes(
                field
              )
            ) {
              return null;
            }

            return (
              <div
                key={field}
                style={{
                  marginBottom: 12
                }}
              >
                <div
                  style={{
                    marginBottom: 4,
                    fontWeight:
                      "bold"
                  }}
                >
                  {labels?.[
                    field
                  ] ?? field}
                </div>

                <input
                  type={
                    field.includes("date")
                      ? "date"
                      : field === "email"
                      ? "email"
                      : field === "phone"
                      ? "tel"
                      : field ===
                        "diploma_number"
                      ? "number"
                      : "text"
                  }
                  value={String(
                    value ?? ""
                  )}
                  onChange={e =>
                    setValues(
                      prev => ({
                        ...prev,
                        [field]:
                          e.target.value
                      })
                    )
                  }
                  style={{
                    width: "100%",
                    padding: 8,
                    boxSizing:
                      "border-box"
                  }}
                />
              </div>
            );
          }
        )}

        <div
          style={{
            display:
              "flex",
            gap: 10,
            marginTop: 20
          }}
        >
          <button
            onClick={() =>
              onSave(
                values
              )
            }
          >
            Сохранить
          </button>

          <button
            onClick={
              onClose
            }
          >
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
}