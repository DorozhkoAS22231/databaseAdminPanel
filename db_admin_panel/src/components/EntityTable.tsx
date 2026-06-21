import { useState } from "react";
import { COLUMN_LABELS } from "../config/columns";
import EditModal from "./EditModal";

interface Props {
  entity:
    | "sports"
    | "teachers"
    | "groups_table"
    | "athletes";

  data: Record<
    string,
    unknown
  >[];

  visibility: Record<
    string,
    Record<string, boolean>
  >;

  onRowClick?: (
    row: Record<
      string,
      unknown
    >
  ) => void;

  onSaveRow?: (
    entity: string,
    row: Record<
      string,
      unknown
    >
  ) => void;

  onDeleteRow?: (
    entity: string,
    id: number
  ) => void;
}

export default function EntityTable({
  entity,
  data,
  visibility,
  onRowClick,
  onSaveRow,
  onDeleteRow
}: Props) {
  const [selectedId,
    setSelectedId] =
    useState<
      number | null
    >(null);

  const [editingRow,
    setEditingRow] =
    useState<
      Record<
        string,
        unknown
      > | null
    >(null);

  if (!data.length) {
    return (
      <div>
        Нет данных
      </div>
    );
  }

  const labels =
    COLUMN_LABELS[
      entity
    ] as Record<
      string,
      string
    >;

  const visibleColumns =
    Object.keys(data[0]).filter(
      column =>
        visibility[
          entity
        ]?.[column] !== false
    );

  return (
    <>
      <EditModal
        entity={entity}
        open={editingRow !== null}
        row={
          editingRow
        }
        onClose={() =>
          setEditingRow(
            null
          )
        }
        onSave={values => {
          onSaveRow?.(
            entity,
            values
          );

          setEditingRow(
            null
          );
        }}
      />

      <table
        border={1}
        cellPadding={6}
        style={{
          width: "100%",
          borderCollapse:
            "collapse"
        }}
      >
        <thead>
          <tr>
            {visibleColumns.map(
              column => (
                <th
                  key={
                    column
                  }
                >
                  {labels?.[
                    column
                  ] ??
                    column}
                </th>
              )
            )}

            <th>
              Действия
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map(
            row => (
              <tr
                key={String(
                  row.id
                )}
                onClick={() => {
                  setSelectedId(
                    Number(
                      row.id
                    )
                  );

                  onRowClick?.(
                    row
                  );
                }}
                style={{
                  cursor:
                    "pointer",

                  background:
                    selectedId ===
                    row.id
                      ? "#eef6ff"
                      : "white"
                }}
              >
                {visibleColumns.map(
                  column => (
                    <td
                      key={
                        column
                      }
                    >
                      {String(
                        row[
                          column
                        ] ?? ""
                      )}
                    </td>
                  )
                )}

                <td
                  style={{
                    whiteSpace:
                      "nowrap"
                  }}
                >
                  <button
                    onClick={e => {
                      e.stopPropagation();

                      setEditingRow(
                        row
                      );
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();

                      if (
                        !window.confirm(
                          "Удалить запись?"
                        )
                      ) {
                        return;
                      }

                      onDeleteRow?.(
                        entity,
                        Number(
                          row.id
                        )
                      );
                    }}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </>
  );
}