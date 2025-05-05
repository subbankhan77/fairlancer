export const ROLES = {
    ADMIN: 'admin',
    FREELANCER: 'freelancer',
    CLIENT: 'client'
  };
  
  export const navigation = {
    [ROLES.ADMIN]: {
      start: [
        { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
        { name: 'Users', path: '/admin/users', icon: 'users' },
      ],
      manage: [
        { name: 'Services', path: '/admin/services', icon: 'services' },
        { name: 'Reports', path: '/admin/reports', icon: 'reports' },
      ]
    },
    [ROLES.FREELANCER]: {
      start: [
        { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { name: 'My Services', path: '/dashboard/services', icon: 'services' },
      ],
      manage: [
        { name: 'Orders', path: '/dashboard/orders', icon: 'orders' },
        { name: 'Earnings', path: '/dashboard/earnings', icon: 'earnings' },
      ]
    },
    [ROLES.CLIENT]: {
      start: [
        { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
        { name: 'Find Services', path: '/dashboard/browse', icon: 'search' },
      ],
      manage: [
        { name: 'My Orders', path: '/dashboard/orders', icon: 'orders' },
        { name: 'Messages', path: '/dashboard/messages', icon: 'messages' },
      ]
    },
    common: {
      account: [
        { name: 'Settings', path: '/dashboard/settings', icon: 'settings' },
        { name: 'Profile', path: '/dashboard/profile', icon: 'profile' },
        { name: 'Logout', path: '/dashboard/logout', icon: 'logout' },
      ]
    }
  };