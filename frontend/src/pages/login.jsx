
import React, { useState } from 'react';
import { endpoints, apiFetch } from '../config/api';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { FiMail, FiLock } from 'react-icons/fi';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await apiFetch(
        endpoints.login,
        {
          method: 'POST',
          body: JSON.stringify({ email, password })
        }
      );
      localStorage.setItem('token', res.token);
      if (onLogin) onLogin();
      navigate('/dashboard');
    } catch (err) {
      setError(err.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Sign in to your account</h2>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5">
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                type="email"
                placeholder="Email address"
                className="pl-10"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                type="password"
                placeholder="Password"
                className="pl-10"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            {error && <div className="text-red-600 text-center text-sm">{error}</div>}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 mt-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{' '}
              <a href="/signup" className="text-blue-600 hover:underline">Sign Up</a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
