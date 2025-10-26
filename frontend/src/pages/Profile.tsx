import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function Profile() {
  const { user, logout } = useAuth();
  if (!user) return null;

  return (
    <div className="mx-auto max-w-md p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-white">Profile</h1>
      <div className="bg-[#1c1c1e] border border-[#2c2c2e] p-4 rounded-lg space-y-3">
        <div className="text-white">
          <span className="text-[#8e8e93]">Name:</span> {user.name}
        </div>
        <div className="text-white">
          <span className="text-[#8e8e93]">Username:</span> {user.username}
        </div>
        <div className="text-white">
          <span className="text-[#8e8e93]">Email:</span> {user.email}
        </div>
      </div>
      <Button onClick={() => logout()} variant="danger">
        Logout
      </Button>
    </div>
  );
}
