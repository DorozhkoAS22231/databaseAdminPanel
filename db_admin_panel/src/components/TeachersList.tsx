interface Props {
  teachers: any[];
  selectedTeacherId: number | null;
  onSelect: (id: number) => void;
}

export default function TeachersList({
  teachers,
  selectedTeacherId,
  onSelect
}: Props) {
  return (
    <div>
      <h2>Тренеры</h2>

      {teachers.map(teacher => (
        <div
          key={teacher.id}
          onClick={() =>
            onSelect(teacher.id)
          }
          style={{
            cursor: "pointer",
            padding: 8,
            marginBottom: 4,
            border: "1px solid #ccc",
            background:
              selectedTeacherId ===
              teacher.id
                ? "#e8e8e8"
                : "white"
          }}
        >
          {teacher.last_name}{" "}
          {teacher.first_name}{" "}
          {teacher.middle_name ?? ""}
        </div>
      ))}
    </div>
  );
}