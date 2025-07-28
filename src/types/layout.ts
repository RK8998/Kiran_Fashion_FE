import { Icon } from 'lucide-react';

export interface NavItem {
  label: string;
  path: string;
  icon: typeof Icon; // Icon component from lucide-react
}
