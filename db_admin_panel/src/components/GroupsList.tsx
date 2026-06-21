interface Props {
  groups: any[];
  selectedGroupId: number | null;
  onSelect: (id: number) => void;
}

export default function GroupsList({
  groups,
  selectedGroupId,
  onSelect
}: Props) {
  return (
    <div>
      <h2>Группы</h2>

      {groups.map(group => (
        <div
          key={group.id}
          onClick={() =>
            onSelect(group.id)
          }
          style={{
            cursor: "pointer",
            padding: 8,
            marginBottom: 4,
            border: "1px solid #ccc",
            background:
              selectedGroupId ===
              group.id
                ? "#e8e8e8"
                : "white"
          }}
        >
          {group.group_name}
        </div>
      ))}
    </div>
  );
}