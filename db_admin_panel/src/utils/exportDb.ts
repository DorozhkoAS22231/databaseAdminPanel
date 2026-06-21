export const exportDb = (
  data: Uint8Array,
  filename = "database.db"
): void => {
  // создаем независимую копию массива
  const copy = new Uint8Array(data);

  const blob = new Blob(
    [copy.buffer],
    {
      type: "application/x-sqlite3"
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};