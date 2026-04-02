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

export function DataTable<T extends { id: number }>({
  columns,
  data,
  renderActions,
  gridClassName = 'grid-cols-[88px_1.1fr_1.2fr_2fr_2fr_110px]',
}: DataTableProps<T>) {
  const gridCols = 'grid-cols-[70px_1fr_1fr_2fr_2fr_100px]'
  const cellStyles =
    'text-md [display:flex] min-w-0 items-center justify-center py-4 px-2 xl:px-4 text-center wrap-break-word line-clamp-4'

  return (
    <div className="flex flex-col gap-1.5">
      {/* Table header */}
      <div
        className={cn(
          'bg-admin-sidebar-active grid divide-x-3 divide-black rounded-2xl',
          gridCols
        )}
      >
        {columns.map((col) => (
          // Cells within the header
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
      <div className="flex max-h-125 min-w-225 flex-col gap-1.5 overflow-x-auto overflow-y-auto">
        {data.map((row) => (
          // Table rows
          <div
            key={row.id}
            className={cn(
              'grid divide-x-3 divide-black/30 rounded-2xl bg-white shadow-sm',
              gridCols
            )}
          >
            {columns.map((col) => (
              // Cells within each row
              <div
                key={String(col.key)}
                className={cn(
                  cellStyles,
                  col.key === 'id' && 'font-bold',
                  col.className
                )}
              >
                {col.key === 'action'
                  ? renderActions?.(row)
                  : col.render
                    ? col.render(row)
                    : String(row[col.key])}
              </div>
            ))}

            <div className={cellStyles}>{renderActions?.(row)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
