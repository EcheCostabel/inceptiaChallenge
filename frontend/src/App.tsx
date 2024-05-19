import React from "react";
import Login from "./Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import DefaultLayout from "./DefaultLayout";


export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<DefaultLayout />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </>
  )
}