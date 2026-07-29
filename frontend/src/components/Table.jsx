export default function Table({ columns, rows, emptyMessage = 'No records found' }) {
  return (
    <div className="overflow-hidden rounded-2xl border-white/10 bg-white/5 backdrop-blur">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-white/5">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-white/50"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-12 text-center text-sm text-white/50" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="hover:bg-white/5 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm text-white/80">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
