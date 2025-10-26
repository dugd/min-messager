import type { FormEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import FormContainer from '../components/FormContainer';
import Input from '../components/Input';
import Link from '../components/Link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const { login } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await login(email, password);
      nav('/profile');
    } catch {
      setErr('Invalid credentials');
    }
  };

  return (
    <FormContainer onSubmit={onSubmit} title="Login">
      <ErrorMessage message={err} />
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit" fullWidth>
        Sign in
      </Button>
      <p className="text-sm text-[#8e8e93] text-center">
        No account? <Link to="/register">Register</Link>
      </p>
    </FormContainer>
  );
}
