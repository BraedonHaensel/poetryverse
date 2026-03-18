'use client'

export type Column<T> = {
  key: keyof T
  label: string
  render?: (row: T) => React.ReactNode
}

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  renderActions?: (row: T) => React.ReactNode
}

export function DataTable<T extends { id: number }>({
  columns,
  data,
  renderActions,
}: DataTableProps<T>) {
  return (
    <div className="flex flex-col gap-3">

      <div className="grid grid-cols-[80px_1fr_1fr_2fr_2fr_80px] rounded-xl bg-black/10  py-3 font-medium">
        {columns.map((col) => (
          <div key={String(col.key)}
            className={`${col.key === 'id' ? 'text-center' : ''}`}
          >{col.label}</div>
        ))}
        <div className="text-center">Action</div>
      </div>

      <div className="max-h-[500px] overflow-y-auto pr-2 flex flex-col gap-3">
        {data.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[80px_1fr_1fr_2fr_2fr_80px] items-center rounded-xl bg-white py-4 shadow-sm"
          >
            {columns.map((col) => (
              <div 
                key={String(col.key)}
                className={`min-w-0 line-clamp-2 ${
                    col.key === 'id' ? 'text-center' : ''
                }`}>
                {col.render ? col.render(row) : String(row[col.key])}
              </div>
            ))}

            <div className="flex justify-center gap-3">
              {renderActions?.(row)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}