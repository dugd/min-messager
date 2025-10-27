import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

export default function AuthActions() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // User is logged in - show user info and logout
  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-white font-medium text-sm">{user.name}</span>
          <span className="text-gray-400 text-xs">@{user.username}</span>
        </div>
        <Button
          variant="secondary"
          onClick={handleLogout}
          className="!px-4 !py-2 text-sm"
        >
          Logout
        </Button>
      </div>
    );
  }

  // User is logged out - show login and register buttons
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        onClick={() => navigate('/login')}
        className="!px-4 !py-2 text-sm"
      >
        Login
      </Button>
      <Button
        variant="primary"
        onClick={() => navigate('/register')}
        className="!px-4 !py-2 text-sm"
      >
        Register
      </Button>
    </div>
  );
}
