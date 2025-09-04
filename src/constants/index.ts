import { Home, Users, Package, BarChart3, StickyNote } from 'lucide-react';

import { NavItem, Roles } from '@/types/layout';

export const ROLES: Roles = {
  admin: 'admin',
  user: 'user',
};
export const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: Home, allowedRoles: [ROLES.admin, ROLES.user] },
  { label: 'Sales', path: '/sales', icon: BarChart3, allowedRoles: [ROLES.admin, ROLES.user] },
  { label: 'Products', path: '/products', icon: Package, allowedRoles: [ROLES.admin, ROLES.user] },
  { label: 'Users', path: '/users', icon: Users, allowedRoles: [ROLES.admin] },
  { label: 'Notes', path: '/notes', icon: StickyNote, allowedRoles: [ROLES.admin, ROLES.user] },
];
