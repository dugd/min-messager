import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navigation() {
  const { user } = useAuth();
  const location = useLocation();

  // Only show navigation when user is logged in
  if (!user) return null;

  const links = [
    { to: '/', label: 'Home' },
    { to: '/chats', label: 'Chats' },
    { to: '/posts', label: 'Posts' },
    { to: '/profile', label: 'Profile' },
  ];

  return (
    <nav className="flex items-center gap-1 sm:gap-2">
      {links.map((link) => {
        const isActive = location.pathname === link.to;
        return (
          <a
            key={link.to}
            href={link.to}
            className={`
              px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${
                isActive
                  ? 'bg-[#0088cc] text-white'
                  : 'text-gray-300 hover:bg-[#2c2c2e] hover:text-white'
              }
            `}
          >
            {link.label}
          </a>
        );
      })}
    </nav>
  );
}
