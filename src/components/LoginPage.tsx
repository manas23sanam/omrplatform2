import React from 'react';
import { Login } from '../pages/Login';

export const LoginPage: React.FC<{ onDemoLogin?: () => void }> = ({ onDemoLogin }) => {
  return <Login onDemoLogin={onDemoLogin} />;
};

export default LoginPage;
