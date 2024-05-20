import React from 'react'
import Dashboard from '../components/Dashboard';
import { Navigate } from 'react-router-dom';

export default function DefaultLayout() {

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };
  return (
    isAuthenticated()
    ? <Dashboard />
    : <Navigate to={'/login'} />
  )
}
