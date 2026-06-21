interface Props {
  sport?: string;
  teacher?: string;
  group?: string;
}

export default function Breadcrumbs({
  sport,
  teacher,
  group
}: Props) {
  return (
    <div
      style={{
        marginBottom: 20,
        fontWeight: "bold"
      }}
    >
      {sport}

      {teacher &&
        ` > ${teacher}`}

      {group &&
        ` > ${group}`}
    </div>
  );
}