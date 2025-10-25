import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <div className="mx-auto max-w-md p-6 space-y-3">
      <h1 className="text-xl font-semibold">Profile</h1>
      <div className="border p-3 rounded">
        <div><b>Name:</b> {user.name}</div>
        <div><b>Username:</b> {user.username}</div>
        <div><b>Email:</b> {user.email}</div>
      </div>
      <button onClick={()=>logout()} className="bg-black text-white px-4 py-2 rounded">Logout</button>
    </div>
  );
}
