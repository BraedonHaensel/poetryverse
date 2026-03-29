'use client'

import { CircleCheckBig, Trash2 } from 'lucide-react'
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
    { key: 'id', header: 'ID' },
    { key: 'name', header: 'Name' },
    { key: 'username', header: 'Username' },
    { key: 'email', header: 'Email' },
    {
      key: 'action',
      header: 'Action',
      render: (user) => (
        <div className="flex items-center gap-4">
          <button onClick={() => handleDelete(user.id)}>
            <Trash2 className="h-5 w-5 text-gray-700 hover:text-red-500" />
          </button>

          <button onClick={() => handlePromote(user.id)}>
            <CircleCheckBig className="h-5 w-5 text-gray-700 hover:text-green-500" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <ShadowCard>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          General User Management
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Search Bar */}
        <div className="mb-4">
          <TableSearch
            value={search}
            onChange={setSearch}
            placeholder="Search users by username..."
          />
        </div>

        {/* Table */}
        <DataTable columns={columns} data={filteredUsers} />
      </CardContent>
    </ShadowCard>
  )
}
