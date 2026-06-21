export const DEFAULT_VISIBILITY = {
  sports: {
    id: false,
    sport_name: true
  },

  teachers: {
    id: false,
    sport_id: false,

    sport_name: true,

    last_name: true,
    first_name: true,
    middle_name: true,

    birth_date: true,

    phone: true,
    email: true,

    passport: false,
    INN: false,
    SNILS: false,

    diploma: true,
    diploma_number: true
  },

  groups_table: {
    id: false,

    sport_id: false,
    teacher_id: false,

    sport_name: true,
    teacher_fio: true,

    group_name: true
  },

  athletes: {
    id: false,

    group_id: false,

    sport_name: true,
    teacher_fio: true,
    group_name: true,

    last_name: true,
    first_name: true,
    middle_name: true,

    birth_date: true,

    birth_certificate: false,

    SNILS: false,

    school: true,

    home_address: true,

    parent: true,

    phone: true,

    department: true,

    category: true
  }
};