import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState('');
  const [err,setErr]=useState<string|null>(null);
  const { login } = useAuth(); const nav = useNavigate();

  const onSubmit = async (e:FormEvent) => {
    e.preventDefault(); setErr(null);
    try { await login(email,password); nav('/profile'); }
    catch { setErr('Invalid credentials'); }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-3 p-6">
      <h1 className="text-xl font-semibold">Login</h1>
      {err && <div className="text-red-600 text-sm">{err}</div>}
      <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="w-full bg-black text-white p-2 rounded">Sign in</button>
      <p className="text-sm">No account? <Link className="underline" to="/register">Register</Link></p>
    </form>
  );
}
