interface Props {
  onLoad: (file: File) => void;
}

export default function FileLoader({
  onLoad
}: Props) {
  return (
    <input
      type="file"
      accept=".db,.sqlite,.sqlite3"
      onChange={e => {
        const file =
          e.target.files?.[0];

        if (file) onLoad(file);
      }}
    />
  );
}