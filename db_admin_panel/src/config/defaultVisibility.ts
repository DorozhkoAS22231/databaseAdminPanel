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

    passport_series: true,
    passport_number: true,
    passport_date: true,
    passport_who: true,

    INN: true,
    SNILS: true,

    category: true,
    rank: true,

    addres: true,

    courses: true,

    diploma: true,
    diploma_number: true
  },

  groups_table: {
    id: false,

    sport_id: false,
    teacher_id: false,

    sport_name: true,
    teacher_fio: true,

    group_name: true,

    number_of_hours: true
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

    birth_certificate: true,

    SNILS: true,

    clotch_size: true,
    shoes_size: true,

    enrollment_date: true,
    enrollment_order: true,

    school: true,

    home_address: true,

    parent: true,

    phone: true,

    department: true,

    category: true,

    sport_status: true
  }
};