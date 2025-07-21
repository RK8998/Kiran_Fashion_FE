import { Home, Users, Package, BarChart3, StickyNote } from 'lucide-react';

import { NavItem } from '@/types/layout';

export const navItems: NavItem[] = [
  { label: 'Home', path: '/', icon: Home },
  { label: 'Users', path: '/users', icon: Users },
  { label: 'Products', path: '/products', icon: Package },
  { label: 'Sales', path: '/sales', icon: BarChart3 },
  { label: 'Notes', path: '/notes', icon: StickyNote },
];
