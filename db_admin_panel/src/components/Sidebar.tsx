import { useState } from "react";

interface Sport {
  id: number;
  sport_name: string;
}

interface Props {
  sports: Sport[];

  selectedSportId:
    | number
    | null;

  onSelect: (
    id: number
  ) => void;

  onAddSport: () => void;

  onRenameSport: (
    id: number,
    name: string
  ) => void;

  onDeleteSport: (
    id: number
  ) => void;
}

export default function Sidebar({
  sports,
  selectedSportId,
  onSelect,
  onAddSport,
  onRenameSport,
  onDeleteSport
}: Props) {
  const [editingId,
    setEditingId] =
    useState<
      number | null
    >(null);

  const [editingName,
    setEditingName] =
    useState("");

  return (
    <div
      style={{
        width: 280,
        borderRight:
          "1px solid #ccc",
        padding: 12,
        display: "flex",
        flexDirection:
          "column"
      }}
    >
      <h3>
        Виды спорта
      </h3>

      <div
        style={{
          flex: 1
        }}
      >
        {sports.map(
          sport => (
            <div
              key={sport.id}
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap: 6,
                padding: 6
              }}
            >
              {editingId ===
              sport.id ? (
                <>
                  <input
                    value={
                      editingName
                    }
                    onChange={e =>
                      setEditingName(
                        e.target
                          .value
                      )
                    }
                  />

                  <button
                    onClick={() => {
                      onRenameSport(
                        sport.id,
                        editingName
                      );

                      setEditingId(
                        null
                      );
                    }}
                  >
                    ✔
                  </button>
                </>
              ) : (
                <>
                  <div
                    style={{
                      flex: 1,
                      cursor:
                        "pointer",
                      background:
                        selectedSportId ===
                        sport.id
                          ? "#dbeafe"
                          : "transparent",
                      padding: 4,
                      borderRadius: 4
                    }}
                    onClick={() =>
                      onSelect(
                        sport.id
                      )
                    }
                  >
                    {
                      sport.sport_name
                    }
                  </div>

                  <button
                    onClick={() => {
                      setEditingId(
                        sport.id
                      );

                      setEditingName(
                        sport.sport_name
                      );
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => {
                      const ok =
                        window.confirm(
                          `Удалить спорт "${sport.sport_name}"?\n\nУдалятся все тренеры, группы и спортсмены.`
                        );

                      if (
                        !ok
                      )
                        return;

                      onDeleteSport(
                        sport.id
                      );
                    }}
                  >
                    🗑
                  </button>
                </>
              )}
            </div>
          )
        )}
      </div>

      <button
        onClick={
          onAddSport
        }
      >
        + Добавить спорт
      </button>
    </div>
  );
}