'use client';
import { login, logout, selectAdmin, selectError } from '@/store/slice/adminSlice';
import { AppDispatch } from '@/store/store';
import { Button, TextField } from '@mui/material';
import { useRouter } from 'next/navigation';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Auth = () => {
  const dispatch: AppDispatch = useDispatch();
  const [password, setPassword] = useState('');
  const admin = useSelector(selectAdmin);
  const error = useSelector(selectError);
  const router = useRouter();

  const handleLogin = () => {
    dispatch(login(password));
  };

  if (admin) {
    console.log('Вход успешен');

    router.push('/');
  }

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <section>
      <div className="w-screen h-screen absolute z-0 top-0 left-0 bg-[#0000004f]"></div>
      {!admin ? (
        <div className="absolute z-10 bg-white p-10 flex top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 flex-col gap-10 max-w-[500px]">
          <TextField
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
          {error && <p>{error}</p>}
        </div>
      ) : (
        <div className="absolute z-10 bg-white p-10 flex top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 flex-col gap-10 max-w-[500px]">
          <p>Welcome, Admin!</p>
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </section>
  );
};

export default Auth;
