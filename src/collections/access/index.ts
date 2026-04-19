import type { Access } from 'payload'

export const isAdmin: Access = ({ req: { user } }) => Boolean(user)

export const publicRead: Access = () => true

export const adminOnly = {
  read: isAdmin,
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}

export const publicReadAdminWrite = {
  read: publicRead,
  create: isAdmin,
  update: isAdmin,
  delete: isAdmin,
}
