export interface Sport {
  id: number;
  sport_name: string;
}

export interface Teacher {
  id: number;
  sport_id: number;

  last_name: string;
  first_name: string;
  middle_name: string | null;

  birth_date?: string | null;

  phone?: string | null;
  email?: string | null;
}

export interface Group {
  id: number;

  sport_id: number;
  teacher_id: number;

  group_name: string;
}

export interface Athlete {
  id: number;

  group_id: number;

  last_name: string;
  first_name: string;
  middle_name: string | null;

  birth_date?: string | null;

  phone?: string | null;
}