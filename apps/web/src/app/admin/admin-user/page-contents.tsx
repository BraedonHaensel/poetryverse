'use client'

import { ArrowDownCircle, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Column, DataTable } from '@/components/admin-table/data-table'
import { TableSearch } from '@/components/admin-table/table-search'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type User = {
  id: number
  name: string
  username: string
  email: string
}

const usersData: User[] = [
  { id: 1, name: 'John Doe', username: '@johndoe20', email: 'john@email.com' },
  {
    id: 2,
    name: 'Jane Miller',
    username: '@janemiller30',
    email: 'janemiller@email.com',
  },
  {
    id: 3,
    name: 'Betty Smith',
    username: '@bettysmith',
    email: 'betty@email.com',
  },
  {
    id: 4,
    name: 'Bob McCarthy',
    username: '@bobmccarthy123',
    email: 'bob@email.com',
  },
]

export default function GeneralUserManagement() {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState(usersData)

  const handleDelete = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const handlePromote = (id: number) => {
    console.log('Promote user:', id)
  }

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  )

  const columns: Column<User>[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
  ]

  return (
    <div className="min-w-200">
      <CardHeader className="px-0 pt-0 pb-5">
        <CardTitle className="text-2xl font-bold">
          Admin User Management
        </CardTitle>
      </CardHeader>

      <ShadowCard className="bg-admin-panel p-3">
        <CardContent className="p-0">
          <div className="mb-4">
            <TableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search users by username..."
            />
          </div>
          {filteredUsers.length === 0 && search.trim() ? (
            <div className="rounded-xl bg-white px-6 py-10 text-center">
              <p className="text-muted-foreground">
                No users found matching &quot;{search}&quot;
              </p>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredUsers}
              gridClassName="grid-cols-[80px_1.2fr_1.4fr_1.6fr_120px]"
              renderActions={(user) => (
                <div className="flex items-center justify-center gap-5">
                  <button
                    type="button"
                    className="cursor-pointer transition hover:opacity-70"
                    onClick={() => handleDelete(user.id)}
                    aria-label="Delete user"
                  >
                    <Trash2 size={28} strokeWidth={2.25} />
                  </button>
                  <button
                    type="button"
                    className="cursor-pointer transition hover:opacity-70"
                    onClick={() => handlePromote(user.id)}
                    aria-label="Promote user"
                  >
                    <ArrowDownCircle size={30} strokeWidth={2.25} />
                  </button>
                </div>
              )}
            />
          )}
        </CardContent>
      </ShadowCard>
    </div>
  )
}
