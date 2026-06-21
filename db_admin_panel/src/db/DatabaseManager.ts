import initSqlJs from "sql.js";

type ColumnInfo = {
  cid: number;
  name: string;
  type: string;
  notnull: number;
  defaultValue: unknown;
  pk: number;
};

export class DatabaseManager {
  private db: any = null;

  async load(file: File): Promise<void> {
  const SQL = await initSqlJs({
    locateFile: wasmFile => {
      console.log(
        "SQL.JS REQUESTED:",
        wasmFile
      );

      return `${import.meta.env.BASE_URL}${wasmFile}`;
    }
  });

  const buffer =
    await file.arrayBuffer();

  this.db = new SQL.Database(
    new Uint8Array(buffer)
  );
}

  private rowsToObjects(
    result: any
  ): Record<string, unknown>[] {
    if (!result.length) {
      return [];
    }

    const columns: string[] =
      result[0].columns;

    return result[0].values.map(
      (values: unknown[]) =>
        Object.fromEntries(
          columns.map(
            (
              column: string,
              index: number
            ) => [
              column,
              values[index]
            ]
          )
        )
    );
  }

  getTables(): string[] {
    if (!this.db) return [];

    const result = this.db.exec(`
      SELECT name
      FROM sqlite_master
      WHERE type='table'
      AND name NOT LIKE 'sqlite_%'
      ORDER BY name
    `);

    return (
      result[0]?.values.map(
        (row: unknown[]) =>
          String(row[0])
      ) ?? []
    );
  }

  getTableData(table: string) {
    if (!this.db) {
      return {
        columns: [],
        rows: []
      };
    }

    const result = this.db.exec(
      `SELECT * FROM ${table}`
    );

    if (!result.length) {
      return {
        columns: [],
        rows: []
      };
    }

    return {
      columns: result[0].columns,
      rows: this.rowsToObjects(
        result
      )
    };
  }

  getColumns(
    table: string
  ): ColumnInfo[] {
    if (!this.db) return [];

    const result = this.db.exec(
      `PRAGMA table_info(${table})`
    );

    if (!result.length) {
      return [];
    }

    return result[0].values.map(
      (
        row: unknown[]
      ): ColumnInfo => ({
        cid: Number(row[0]),
        name: String(row[1]),
        type: String(row[2]),
        notnull: Number(row[3]),
        defaultValue: row[4],
        pk: Number(row[5])
      })
    );
  }

  updateCell(
    table: string,
    id: number,
    field: string,
    value: unknown
  ): void {
    if (!this.db) return;

    this.db.run(
      `
      UPDATE ${table}
      SET ${field}=?
      WHERE id=?
      `,
      [value, id]
    );
  }

  insertRow(
    table: string,
    data: Record<
      string,
      unknown
    >
  ): void {
    if (!this.db) return;

    const keys =
      Object.keys(data);

    const placeholders =
      keys
        .map(() => "?")
        .join(",");

    this.db.run(
      `
      INSERT INTO ${table}
      (${keys.join(",")})
      VALUES (${placeholders})
      `,
      Object.values(data)
    );
  }

  deleteRow(
    table: string,
    id: number
  ): void {
    if (!this.db) return;

    this.db.run(
      `
      DELETE FROM ${table}
      WHERE id=?
      `,
      [id]
    );
  }

  createEmptyRow(
    table: string
  ): void {
    const columns =
      this.getColumns(table);

    const row: Record<
      string,
      unknown
    > = {};

    columns.forEach(
      (
        column: ColumnInfo
      ) => {
        if (
          column.pk === 1 &&
          column.name === "id"
        ) {
          return;
        }

        row[column.name] = "";
      }
    );

    this.insertRow(
      table,
      row
    );
  }

  saveDatabase(): Uint8Array {
    if (!this.db) {
      throw new Error(
        "Database not loaded"
      );
    }

    return this.db.export();
  }

  close(): void {
    if (!this.db) return;

    this.db.close();
    this.db = null;
  }

  // ==========================
  // SPORTS
  // ==========================

  getSports() {
    if (!this.db) return [];

    const result = this.db.exec(`
      SELECT *
      FROM sports
      ORDER BY sport_name
    `);

    return this.rowsToObjects(
      result
    );
  }

  // ==========================
  // TEACHERS
  // ==========================

  getTeachersBySport(
  sportId: number
) {
  if (!this.db) return [];

  const result = this.db.exec(`
    SELECT
      t.*,
      s.sport_name
    FROM teachers t

    LEFT JOIN sports s
      ON s.id=t.sport_id

    WHERE t.sport_id=${sportId}

    ORDER BY t.last_name
  `);

  return this.rowsToObjects(
    result
  );
}

  // ==========================
  // GROUPS
  // ==========================

  getGroupsByTeacher(
  teacherId: number
) {
  if (!this.db) return [];

  const result = this.db.exec(`
    SELECT
      g.*,

      s.sport_name,

      t.last_name ||
      ' ' ||
      t.first_name ||
      ' ' ||
      COALESCE(
        t.middle_name,
        ''
      ) AS teacher_fio

    FROM groups_table g

    LEFT JOIN sports s
      ON s.id=g.sport_id

    LEFT JOIN teachers t
      ON t.id=g.teacher_id

    WHERE g.teacher_id=${teacherId}

    ORDER BY g.group_name
  `);

  return this.rowsToObjects(
    result
  );
}

  // ==========================
  // ATHLETES
  // ==========================

  getAthletesByGroup(
  groupId: number
) {
  if (!this.db) return [];

  const result = this.db.exec(`
    SELECT
      a.*,

      g.group_name,

      s.sport_name,

      t.last_name ||
      ' ' ||
      t.first_name ||
      ' ' ||
      COALESCE(
        t.middle_name,
        ''
      ) AS teacher_fio

    FROM athletes a

    LEFT JOIN groups_table g
      ON g.id=a.group_id

    LEFT JOIN sports s
      ON s.id=g.sport_id

    LEFT JOIN teachers t
      ON t.id=g.teacher_id

    WHERE a.group_id=${groupId}

    ORDER BY a.last_name
  `);

  return this.rowsToObjects(
    result
  );
}

  // ==========================
  // DETAILS
  // ==========================

  getSportById(
    sportId: number
  ) {
    const sports =
      this.getSports();

    return sports.find(
      (sport: any) =>
        sport.id === sportId
    );
  }

  getTeacherById(
    teacherId: number
  ) {
    if (!this.db) return null;

    const result = this.db.exec(`
      SELECT *
      FROM teachers
      WHERE id=${teacherId}
      LIMIT 1
    `);

    const rows =
      this.rowsToObjects(
        result
      );

    return rows[0] ?? null;
  }

  getGroupById(
    groupId: number
  ) {
    if (!this.db) return null;

    const result = this.db.exec(`
      SELECT *
      FROM groups_table
      WHERE id=${groupId}
      LIMIT 1
    `);

    const rows =
      this.rowsToObjects(
        result
      );

    return rows[0] ?? null;
  }
  addSport(
  sportName: string
) {
  if (!this.db) return;

  this.db.run(
    `
    INSERT INTO sports (
      sport_name
    )
    VALUES (?)
    `,
    [sportName]
  );
}

addTeacher(
  sportId: number
) {
  if (!this.db) return;

  this.db.run(
    `
    INSERT INTO teachers (
      sport_id,
      last_name,
      first_name
    )
    VALUES (
      ?,
      'Новый',
      'Тренер'
    )
  `,
    [sportId]
  );
}

addGroup(
  sportId: number,
  teacherId: number
) {
  if (!this.db) return;

  this.db.run(
    `
    INSERT INTO groups_table (
      sport_id,
      teacher_id,
      group_name
    )
    VALUES (
      ?,
      ?,
      'Новая группа'
    )
  `,
    [
      sportId,
      teacherId
    ]
  );
}

addAthlete(
  groupId: number
) {
  if (!this.db) return;

  this.db.run(
    `
    INSERT INTO athletes (
      group_id,
      last_name,
      first_name
    )
    VALUES (
      ?,
      'Новый',
      'Спортсмен'
    )
  `,
    [groupId]
  );
}
deleteRecord(
  table: string,
  id: number
) {
  if (!this.db) return;

  this.db.run(
    `
    DELETE FROM ${table}
    WHERE id=?
  `,
    [id]
  );
}
updateRow(
  table: string,
  data: Record<
    string,
    unknown
  >
) {
  if (!this.db) return;

  const id =
    Number(data.id);

  const excludedFields = [
    "id",
    "sport_name",
    "teacher_fio",
    "group_name"
  ];

  const fields =
    Object.keys(data)
      .filter(
        key =>
          !excludedFields.includes(
            key
          )
      );

  const setClause =
    fields
      .map(
        field =>
          `${field}=?`
      )
      .join(",");

  const values =
    fields.map(
      field =>
        data[field]
    );

  values.push(id);

  this.db.run(
    `
    UPDATE ${table}
    SET ${setClause}
    WHERE id=?
    `,
    values
  );
}
updateSport(
  id: number,
  name: string
) {
  if (!this.db) return;

  this.db.run(
    `
    UPDATE sports
    SET sport_name=?
    WHERE id=?
    `,
    [name, id]
  );
}

deleteSport(
  id: number
) {
  if (!this.db) return;

  this.db.run(
    `
    DELETE FROM sports
    WHERE id=?
    `,
    [id]
  );
}



}