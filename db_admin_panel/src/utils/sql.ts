export interface ColumnInfo {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  dflt_value: any;
  pk: number;
}

export function buildInsertQuery(
  table: string,
  data: Record<string, any>
) {
  const keys = Object.keys(data);

  const placeholders = keys
    .map(() => "?")
    .join(",");

  return {
    sql: `
      INSERT INTO ${table}
      (${keys.join(",")})
      VALUES (${placeholders})
    `,
    values: Object.values(data)
  };
}

export function buildUpdateQuery(
  table: string,
  id: number,
  field: string
) {
  return {
    sql: `
      UPDATE ${table}
      SET ${field}=?
      WHERE id=?
    `,
    values: [id]
  };
}

export function buildDeleteQuery(
  table: string
) {
  return `
    DELETE FROM ${table}
    WHERE id=?
  `;
}