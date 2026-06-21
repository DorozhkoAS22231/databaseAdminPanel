interface Props {
  athletes: any[];
}

export default function AthletesList({
  athletes
}: Props) {
  return (
    <div>
      <h2>Спортсмены</h2>

      <table
        border={1}
        cellPadding={6}
      >
        <thead>
          <tr>
            <th>Фамилия</th>
            <th>Имя</th>
            <th>Отчество</th>
          </tr>
        </thead>

        <tbody>
          {athletes.map(
            athlete => (
              <tr
                key={athlete.id}
              >
                <td>
                  {
                    athlete.last_name
                  }
                </td>

                <td>
                  {
                    athlete.first_name
                  }
                </td>

                <td>
                  {athlete.middle_name}
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}