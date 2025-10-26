import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import FormContainer from '../components/FormContainer';
import Input from '../components/Input';
import Link from '../components/Link';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [err, setErr] = useState<string | null>(null);
  const { register } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await register(form);
      nav('/profile');
    } catch {
      setErr('Registration failed');
    }
  };

  return (
    <FormContainer onSubmit={onSubmit} title="Register">
      <ErrorMessage message={err} />
      <Input
        type="text"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <Input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <Input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <Input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <Input
        type="password"
        placeholder="Confirm password"
        value={form.password_confirmation}
        onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
      />
      <Button type="submit" fullWidth>
        Create account
      </Button>
      <p className="text-sm text-[#8e8e93] text-center">
        Have account? <Link to="/login">Login</Link>
      </p>
    </FormContainer>
  );
}
