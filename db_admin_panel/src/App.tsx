import { useState } from "react";
import { saveAs } from "file-saver";

import FileLoader from "./components/FileLoader";
import Sidebar from "./components/Sidebar";
import Breadcrumbs from "./components/Breadcrumbs";
import ColumnSelector from "./components/ColumnSelector";
import EntityTable from "./components/EntityTable";

import { DatabaseManager } from "./db/DatabaseManager";
import { useColumnVisibility } from "./hooks/useColumnVisibility";
import { useEffect } from "react";

const dbManager = new DatabaseManager();

export default function App() {
  const [sports, setSports] = useState<any[]>([]);

  const [teachers, setTeachers] = useState<any[]>([]);

  const [groups, setGroups] = useState<any[]>([]);

  const [athletes, setAthletes] = useState<any[]>([]);

  const [dbFileName, setDbFileName] = useState("database.db");

  const [selectedSport,setSelectedSport] = useState<any>(null);

  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);

  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const {visibility, setVisibility} = useColumnVisibility();

  const [viewMode,
  setViewMode] =
  useState<
    "tree" |
    "all"
  >("tree");

  const [teacherSearch,
  setTeacherSearch] =
  useState("");

const [groupSearch,
  setGroupSearch] =
  useState("");

const [athleteSearch,
  setAthleteSearch] =
  useState("");


  useEffect(() => {
  if (!sports.length) {
    return;
  }

  refreshData();
}, [viewMode]);

  const exportDatabase = () => {
  const data =
    dbManager.saveDatabase();

  const bytes =
    Array.from(data);

  const blob =
    new Blob(
      [
        new Uint8Array(
          bytes
        )
      ],
      {
        type:
          "application/octet-stream"
      }
    );

  saveAs(
    blob,
    dbFileName
  );
};

  const refreshData = () => {
  setSports(
    dbManager.getSports()
  );

  if (viewMode === "all") {
    setTeachers(
      dbManager.getAllTeachers()
    );

    setGroups(
      dbManager.getAllGroups()
    );

    setAthletes(
      dbManager.getAllAthletes()
    );

    return;
  }

  if (selectedSport) {
    setTeachers(
      dbManager.getTeachersBySport(
        Number(selectedSport.id)
      )
    );
  } else {
    setTeachers([]);
  }

  if (selectedTeacher) {
    setGroups(
      dbManager.getGroupsByTeacher(
        Number(selectedTeacher.id)
      )
    );
  } else {
    setGroups([]);
  }

  if (selectedGroup) {
    setAthletes(
      dbManager.getAthletesByGroup(
        Number(selectedGroup.id)
      )
    );
  } else {
    setAthletes([]);
  }
};

  const loadDb =
    async (
      file: File
    ) => {
      await dbManager.load(
        file
      );

      setDbFileName(
        file.name
      );

      setSports(
        dbManager.getSports()
      );

      setTeachers([]);
      setGroups([]);
      setAthletes([]);

      setSelectedSport(
        null
      );

      setSelectedTeacher(
        null
      );

      setSelectedGroup(
        null
      );
    };

  const selectSport =
    (
      sport: any
    ) => {
      if (
        selectedSport?.id ===
        sport.id
      ) {
        setSelectedSport(
          null
        );

        setSelectedTeacher(
          null
        );

        setSelectedGroup(
          null
        );

        setTeachers([]);
        setGroups([]);
        setAthletes([]);

        return;
      }

      setSelectedSport(
        sport
      );

      setSelectedTeacher(
        null
      );

      setSelectedGroup(
        null
      );

      setGroups([]);
      setAthletes([]);

      setTeachers(
        dbManager.getTeachersBySport(
          Number(
            sport.id
          )
        )
      );
    };

  const selectTeacher =
    (
      teacher: any
    ) => {
      if (
        selectedTeacher?.id ===
        teacher.id
      ) {
        setSelectedTeacher(
          null
        );

        setSelectedGroup(
          null
        );

        setGroups([]);
        setAthletes([]);

        return;
      }

      setSelectedTeacher(
        teacher
      );

      setSelectedGroup(
        null
      );

      setAthletes([]);

      setGroups(
        dbManager.getGroupsByTeacher(
          Number(
            teacher.id
          )
        )
      );
    };

  const selectGroup =
    (
      group: any
    ) => {
      if (
        selectedGroup?.id ===
        group.id
      ) {
        setSelectedGroup(
          null
        );

        setAthletes([]);

        return;
      }

      setSelectedGroup(
        group
      );

      setAthletes(
        dbManager.getAthletesByGroup(
          Number(
            group.id
          )
        )
      );
    };

  const saveRow =
    (
      entity: string,
      row: Record<
        string,
        unknown
      >
    ) => {
      dbManager.updateRow(
        entity,
        row
      );

      refreshData();
    };

  const deleteRow =
    (
      entity: string,
      id: number
    ) => {
      dbManager.deleteRecord(
        entity,
        id
      );

      refreshData();
    };

  return (
    <div>
      <div
        style={{
          padding: 10,
          borderBottom:
            "1px solid #ddd",
          display: "flex",
          gap: 10
        }}
      >
        <FileLoader
          onLoad={loadDb}
        />

        <button
          onClick={
            exportDatabase
          }
        >
          💾 Скачать БД
        </button>
      </div>

      <div
        style={{
          display:
            "flex",
          minHeight:
            "90vh"
        }}
      >
        <Sidebar
          sports={sports}
          selectedSportId={
            selectedSport?.id ??
            null
          }
          onSelect={id => {
            const sport =
              sports.find(
                s =>
                  s.id === id
              );
            
            if (sport) {
              selectSport(
                sport
              );
            }
          }}
          onAddSport={() => {
            const name =
              prompt(
                "Название спорта"
              );
            
            if (!name) {
              return;
            }
          
            dbManager.addSport(
              name
            );
          
            refreshData();
          }}
          onRenameSport={(
            id,
            name
          ) => {
            dbManager.updateSport(
              id,
              name
            );
          
            refreshData();
          }}
          onDeleteSport={id => {
            dbManager.deleteSport(
              id
            );
          
            refreshData();
          
            if (
              selectedSport?.id ===
              id
            ) {
              setSelectedSport(
                null
              );
            
              setSelectedTeacher(
                null
              );
            
              setSelectedGroup(
                null
              );
            
              setTeachers([]);
              setGroups([]);
              setAthletes([]);
            }
          }}
        />

        <div
          style={{
            flex: 1,
            padding: 20
          }}
        >
          <Breadcrumbs
            sport={
              selectedSport?.sport_name
            }
            teacher={
              selectedTeacher
                ? `${selectedTeacher.last_name} ${selectedTeacher.first_name}`
                : undefined
            }
            group={
              selectedGroup?.group_name
            }
          />

          <div
  style={{
    display: "flex",
    gap: 20,
    marginBottom: 20,
    alignItems: "center"
  }}
>
  <b>
    Режим просмотра:
  </b>

  <label>
    <input
      type="radio"
      checked={
        viewMode ===
        "tree"
      }
      onChange={() =>
        setViewMode(
          "tree"
        )
      }
    />

    Иерархический
  </label>

  <label>
    <input
      type="radio"
      checked={
        viewMode ===
        "all"
      }
      onChange={() =>
        setViewMode(
          "all"
        )
      }
    />

    Общий
  </label>
</div>

    {(viewMode === "all" || selectedSport) && (
  <>
    <h2>
      Тренеры
    </h2>

    <ColumnSelector
      entity="teachers"
      visibility={visibility}
      setVisibility={setVisibility}
    />

    <input
      type="text"
      placeholder="🔍 Поиск тренеров..."
      value={teacherSearch}
      onChange={e =>
        setTeacherSearch(
          e.target.value
        )
      }
      style={{
        width: "100%",
        padding: 8,
        marginBottom: 10,
        boxSizing: "border-box"
      }}
    />

    <EntityTable
      entity="teachers"
      data={teachers.filter(row =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(
            teacherSearch.toLowerCase()
          )
      )}
      visibility={visibility}
      onRowClick={selectTeacher}
      onSaveRow={saveRow}
      onDeleteRow={deleteRow}
    />

    <div
      style={{
        marginTop: 10
      }}
    >
      {viewMode === "tree" && (
  <div
    style={{
      marginTop: 10
    }}
  >
    <button
      onClick={() => {
        if (!selectedSport)
          return;

        dbManager.addTeacher(
          Number(selectedSport.id)
        );

        refreshData();
      }}
    >
      + Добавить тренера
    </button>
  </div>
)}
    </div>
  </>
)}

{(viewMode === "all" || selectedTeacher) && (
  <>
    <h2>
      Группы
    </h2>

    <ColumnSelector
      entity="groups_table"
      visibility={visibility}
      setVisibility={setVisibility}
    />

    <input
      type="text"
      placeholder="🔍 Поиск групп..."
      value={groupSearch}
      onChange={e =>
        setGroupSearch(
          e.target.value
        )
      }
      style={{
        width: "100%",
        padding: 8,
        marginBottom: 10,
        boxSizing: "border-box"
      }}
    />

    <EntityTable
      entity="groups_table"
      data={groups.filter(row =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(
            groupSearch.toLowerCase()
          )
      )}
      visibility={visibility}
      onRowClick={selectGroup}
      onSaveRow={saveRow}
      onDeleteRow={deleteRow}
    />

    <div
      style={{
        marginTop: 10
      }}
    >
      {viewMode === "tree" && (
  <div
    style={{
      marginTop: 10
    }}
  >
    <button
      onClick={() => {
        if (
          !selectedSport ||
          !selectedTeacher
        )
          return;

        dbManager.addGroup(
          Number(selectedSport.id),
          Number(selectedTeacher.id)
        );

        refreshData();
      }}
    >
      + Добавить группу
    </button>
  </div>
)}
    </div>
  </>
)}

{(viewMode === "all" || selectedGroup) && (
  <>
    <h2>
      Спортсмены
    </h2>

    <ColumnSelector
      entity="athletes"
      visibility={visibility}
      setVisibility={setVisibility}
    />

    <input
      type="text"
      placeholder="🔍 Поиск спортсменов..."
      value={athleteSearch}
      onChange={e =>
        setAthleteSearch(
          e.target.value
        )
      }
      style={{
        width: "100%",
        padding: 8,
        marginBottom: 10,
        boxSizing: "border-box"
      }}
    />

    <EntityTable
      entity="athletes"
      data={athletes.filter(row =>
        Object.values(row)
          .join(" ")
          .toLowerCase()
          .includes(
            athleteSearch.toLowerCase()
          )
      )}
      visibility={visibility}
      onSaveRow={saveRow}
      onDeleteRow={deleteRow}
    />

    <div
      style={{
        marginTop: 10
      }}
    >
      {viewMode === "tree" && (
  <div
    style={{
      marginTop: 10
    }}
  >
    <button
      onClick={() => {
        if (!selectedGroup)
          return;

        dbManager.addAthlete(
          Number(selectedGroup.id)
        );

        refreshData();
      }}
    >
      + Добавить спортсмена
    </button>
  </div>
)}
    </div>
  </>
)}
        </div>
      </div>
    </div>
  );
}