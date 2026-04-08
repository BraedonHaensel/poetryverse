'use client'

import { ArrowDownCircle, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Column, DataTable } from '@/components/admin-table/data-table'
import { TableSearch } from '@/components/admin-table/table-search'
import { ConfirmationDialog } from '@/components/confirmation-dialog'
import PageLoadingIndicator from '@/components/page-loading-indicator'
import { ShadowCard } from '@/components/shadow-card'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAdminUser } from '@/context/admin-user-context'
import { deleteUser, getUsers, updateUserRole } from '@/lib/admin-user-requests'
import { UserData, UserRole } from '@/lib/user-requests'

type ManagedUser = {
  id: string
  name: string
  username: string
  email: string
}

function mapUserToManagedUser(user: UserData): ManagedUser {
  return {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
  }
}

async function fetchAdminUsersSnapshot(): Promise<ManagedUser[]> {
  const users = await getUsers(UserRole.ADMIN)
  return (users ?? []).map(mapUserToManagedUser)
}

export default function AdminUserManagement() {
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isRevokeConfirmOpen, setIsRevokeConfirmOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const didFetch = useRef(false)
  const adminUser = useAdminUser()
  const isSuperAdmin = adminUser.role === UserRole.SUPER_ADMIN

  useEffect(() => {
    if (didFetch.current) return
    didFetch.current = true

    async function initializeUsers() {
      try {
        const data = await fetchAdminUsersSnapshot()
        setUsers(data)
      } finally {
        setIsLoading(false)
      }
    }

    void initializeUsers()
  }, [])

  async function refreshUsers() {
    const data = await fetchAdminUsersSnapshot()
    setUsers(data)
  }

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        user.username.toLowerCase().includes(search.toLowerCase())
      ),
    [users, search]
  )

  const columns: Column<ManagedUser>[] = [
    {
      key: 'id',
      label: 'ID',
      className:
        'text-left text-xs font-normal',
      headerClassName: 'text-sm',
    },
    { key: 'name', label: 'Name' },
    { key: 'username', label: 'Username' },
    { key: 'email', label: 'Email' },
  ]

  const handleOpenRevokeDialog = (user: ManagedUser) => {
    setSelectedUser(user)
    setIsRevokeConfirmOpen(true)
  }

  const handleCloseRevokeDialog = () => {
    setIsRevokeConfirmOpen(false)
    setSelectedUser(null)
  }

  const handleRevokeConfirm = async () => {
    if (!selectedUser) return

    setIsSubmitting(true)

    const updatedUser = await updateUserRole(selectedUser.id, UserRole.USER)

    if (updatedUser) {
      toast.success('Admin privileges revoked')
      await refreshUsers()
      handleCloseRevokeDialog()
    }

    setIsSubmitting(false)
  }

  const handleOpenDeleteDialog = (user: ManagedUser) => {
    setSelectedUser(user)
    setIsDeleteConfirmOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setIsDeleteConfirmOpen(false)
    setSelectedUser(null)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return

    setIsSubmitting(true)

    const success = await deleteUser(selectedUser.id)

    if (success) {
      toast.success('Admin user deleted')
      await refreshUsers()
      handleCloseDeleteDialog()
    }

    setIsSubmitting(false)
  }

  if (isLoading) return <PageLoadingIndicator />

  return (
    <>
      <ConfirmationDialog
        isOpen={isDeleteConfirmOpen}
        title={
          selectedUser
            ? `Are you sure you want to delete ${selectedUser.username}?`
            : 'Are you sure you want to delete this user?'
        }
        description="This action cannot be undone."
        onClose={handleCloseDeleteDialog}
        onAction={handleDeleteConfirm}
        variant="delete"
      />
      <ConfirmationDialog
        isOpen={isRevokeConfirmOpen}
        title={
          selectedUser
            ? `Are you sure you want to revoke admin privileges from ${selectedUser.username}?`
            : 'Are you sure you want to revoke admin privileges from this user?'
        }
        description="This user will lose their admin privileges."
        onClose={handleCloseRevokeDialog}
        onAction={handleRevokeConfirm}
        variant="default"
      />

      <div
        className={`w-full min-w-0 ${isSubmitting ? 'pointer-events-none opacity-70' : ''}`}
      >
        {/* Desktop */}
        <div className="hidden min-w-200 md:block">
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
              ) : filteredUsers.length === 0 ? (
                <div className="rounded-xl bg-white px-6 py-10 text-center">
                  <p className="text-muted-foreground">
                    There are no admin users to display.
                  </p>
                </div>
              ) : (
                <DataTable
                  columns={columns}
                  data={filteredUsers}
                  gridClassName={
                    isSuperAdmin
                      ? 'grid-cols-[1.1fr_1.1fr_1.2fr_1.6fr_120px]'
                      : 'grid-cols-[1.1fr_1.1fr_1.2fr_1.8fr_72px]'
                  }
                  renderActions={(user) =>
                    isSuperAdmin ? (
                      <div className="flex items-center justify-center gap-5">
                        <button
                          type="button"
                          className="cursor-pointer transition hover:opacity-70"
                          onClick={() => handleOpenDeleteDialog(user)}
                          aria-label="Delete user"
                        >
                          <Trash2 size={28} strokeWidth={2.25} />
                        </button>

                        <button
                          type="button"
                          className="cursor-pointer transition hover:opacity-70"
                          onClick={() => handleOpenRevokeDialog(user)}
                          aria-label="Revoke admin privileges"
                        >
                          <ArrowDownCircle size={30} strokeWidth={2.25} />
                        </button>
                      </div>
                    ) : null
                  }
                />
              )}
            </CardContent>
          </ShadowCard>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <div className="p-3">
            <div className="mb-4">
              <TableSearch
                value={search}
                onChange={setSearch}
                placeholder="Search users by username..."
              />
            </div>

            {filteredUsers.length === 0 && search.trim() ? (
              <div className="rounded-xl bg-white px-5 py-8 text-center">
                <p className="text-muted-foreground">
                  No users found matching &quot;{search}&quot;
                </p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="rounded-xl bg-white px-5 py-8 text-center">
                <p className="text-muted-foreground">
                  There are no admin users to display.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-md bg-white px-3 py-2 shadow-sm"
                  >
                    <div className="space-y-1 text-sm leading-tight text-black/80">
                      <p className="text-xs font-normal break-all">
                        ID: {user.id}
                      </p>

                      <div>
                        <p className="text-sm text-black/50 italic">Name</p>
                        <p>{user.name}</p>
                      </div>

                      <div>
                        <p className="text-sm text-black/50 italic">Username</p>
                        <p>{user.username}</p>
                      </div>

                      <div>
                        <p className="text-sm text-black/50 italic">Email</p>
                        <p>{user.email}</p>
                      </div>
                    </div>

                    {isSuperAdmin && (
                      <div className="mt-3 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleOpenDeleteDialog(user)}
                          className="cursor-pointer rounded bg-red-800 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase transition hover:opacity-80"
                        >
                          Delete
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenRevokeDialog(user)}
                          className="cursor-pointer rounded bg-slate-500 px-3 py-1 text-xs font-bold tracking-wide text-white uppercase transition hover:opacity-80"
                        >
                          Revoke
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
