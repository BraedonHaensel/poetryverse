'use client'

import { cn } from '@/lib/utils'

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

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  renderActions,
  gridClassName = 'grid-cols-[88px_1.1fr_1.2fr_2fr_2fr_110px]',
}: DataTableProps<T>) {
  const cellStyles =
    'text-md [display:flex] items-center justify-center py-4 px-2 xl:px-4 text-center wrap-break-word'

  return (
    <div className="flex flex-col gap-1.5">
      {/* Table header */}
      <div
        className={cn(
          'bg-admin-sidebar-active grid divide-x-3 divide-black rounded-2xl border-2 border-black/40 shadow-md',
          gridClassName
        )}
      >
        {columns.map((col) => (
          <div
            key={String(col.key)}
            className={cn(
              cellStyles,
              'font-bold',
              col.key === 'id' && 'font-extrabold',
              col.headerClassName
            )}
          >
            {col.label}
          </div>
        ))}

        <div className={cn(cellStyles, 'font-bold')}>Action</div>
      </div>

      {/* Table contents */}
      <div className="flex max-h-125 flex-col gap-1.5 overflow-y-auto">
        {data.map((row) => (
          <div
            key={row.id}
            className={cn(
              'grid divide-x-3 divide-black/30 rounded-2xl border border-black/30 bg-white shadow-sm',
              gridClassName
            )}
          >
            {columns.map((col) => (
              <div
                key={String(col.key)}
                className={cn(cellStyles, col.className)}
              >
                {col.render ? col.render(row) : String(row[col.key])}
              </div>
            ))}

            <div className={cellStyles}>{renderActions?.(row)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
