import type { FormEvent } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form,setForm]=useState({name:'',username:'',email:'',password:'',password_confirmation:''});
  const [err,setErr]=useState<string|null>(null);
  const { register } = useAuth(); const nav = useNavigate();

  const onSubmit = async (e:FormEvent) => {
    e.preventDefault(); setErr(null);
    try { await register(form); nav('/profile'); }
    catch { setErr('Registration failed'); }
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-3 p-6">
      <h1 className="text-xl font-semibold">Register</h1>
      {err && <div className="text-red-600 text-sm">{err}</div>}
      {(['name','username','email'] as const).map(k=>(
        <input key={k} className="w-full border p-2 rounded" placeholder={k} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})}/>
      ))}
      <input className="w-full border p-2 rounded" placeholder="password" type="password"
             value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
      <input className="w-full border p-2 rounded" placeholder="confirm password" type="password"
             value={form.password_confirmation} onChange={e=>setForm({...form,password_confirmation:e.target.value})}/>
      <button className="w-full bg-black text-white p-2 rounded">Create account</button>
      <p className="text-sm">Have account? <Link className="underline" to="/login">Login</Link></p>
    </form>
  );
}
