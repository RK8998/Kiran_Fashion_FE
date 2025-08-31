import React from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
import { Avatar } from '@heroui/avatar';
import { LogOut, User } from 'lucide-react'; // optional icons
import { useNavigate } from 'react-router-dom';

import { AUTH_TOKEN, localStorageHandler } from '@/helpers/storage';

interface HeaderProfileMenuProps {
  user: {
    name: string;
    avatar?: string;
  };
}

const HeaderProfileMenu: React.FC<HeaderProfileMenuProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorageHandler('REMOVE', AUTH_TOKEN);
    navigate('/login');
  };

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          className="cursor-pointer border-2 border-primary-400 bg-primary-100 text-primary-700 font-bold"
          name={user?.name}
          size="sm"
          src={user?.avatar || ''}
        >
          {!user?.avatar && user?.name?.charAt(0).toUpperCase()}
        </Avatar>
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Menu">
        <DropdownItem key="profile" startContent={<User size={16} />}>
          {user?.name}
        </DropdownItem>
        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          startContent={<LogOut size={16} />}
          onPress={handleLogout}
        >
          Logout
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default HeaderProfileMenu;
