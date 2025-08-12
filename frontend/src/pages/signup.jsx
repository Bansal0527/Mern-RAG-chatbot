
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
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

const Signup = ({ onSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch(
        endpoints.register,
        {
          method: 'POST',
          body: JSON.stringify({ email, password })
        }
      );
      localStorage.setItem('token', res.token);
      if (onSignup) onSignup();
      navigate('/dashboard');
    } catch (err) {
      setError(err.error || 'Signup failed');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">Create your account</h2>
        </CardHeader>
        <form onSubmit={handleSignup}>
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
                autoComplete="new-password"
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                type="password"
                placeholder="Confirm Password"
                className="pl-10"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            {error && <div className="text-red-600 text-center text-sm">{error}</div>}
          </CardContent>
          <CardFooter className="flex flex-col gap-3 mt-4">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
            <div className="text-center text-sm text-gray-500">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:underline">Login</a>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
