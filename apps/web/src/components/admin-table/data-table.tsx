'use client'

export type Column<T> = {
  key: keyof T
  label: string
  render?: (row: T) => React.ReactNode
  className?: string
  headerClassName?: string
}

type DataTableProps<T> = {
  columns: Column<T>[]
  data: T[]
  renderActions?: (row: T) => React.ReactNode
  gridClassName?: string
}

export function DataTable<T extends { id: number }>({
  columns,
  data,
  renderActions,
  gridClassName = 'grid-cols-[88px_1.1fr_1.2fr_2fr_2fr_110px]',
}: DataTableProps<T>) {
  return (
    <div className="flex flex-col gap-4">
      <div
        className={[
          'bg-admin-sidebar-active grid items-center rounded-2xl px-6 py-4 text-sm font-semibold text-black',
          gridClassName,
        ].join(' ')}
      >
        {columns.map((col) => (
          <div
            key={String(col.key)}
            className={[
              'min-w-0 font-bold',
              col.key === 'id' ? 'text-center' : '',
              col.headerClassName ?? '',
            ].join(' ')}
          >
            {col.label}
          </div>
        ))}
        <div className="px-4 text-center font-bold">Action</div>
      </div>

      <div className="flex max-h-[500px] flex-col gap-4 overflow-y-auto pr-2">
        {data.map((row) => (
          <div
            key={row.id}
            className={[
              'grid items-center rounded-2xl bg-white px-6 py-6 shadow-sm',
              gridClassName,
            ].join(' ')}
          >
            {columns.map((col) => (
              <div
                key={String(col.key)}
                className={[
                  'min-w-0 text-sm leading-6 text-black',
                  col.key === 'id' ? 'text-center font-semibold' : '',
                  col.className ?? '',
                ].join(' ')}
              >
                {col.render ? col.render(row) : String(row[col.key])}
              </div>
            ))}

            <div className="flex items-center justify-center gap-4">
              {renderActions?.(row)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
