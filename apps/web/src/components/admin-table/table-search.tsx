'use client'
import { Search } from 'lucide-react'

type TableSearchProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function TableSearch({
  value,
  onChange,
  placeholder = 'Search users by username...',
}: TableSearchProps) {
  return (
    <div className="card rounded-xl bg-white p-3 shadow-sm">
      <div className="relative">
        <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="placeholder:text-muted-foreground bg-off-white h-11 w-full rounded-xl pr-4 pl-10 placeholder:italic focus:ring-2 focus:ring-gray-300 focus:outline-none"
        />
      </div>
    </div>
  )
}
