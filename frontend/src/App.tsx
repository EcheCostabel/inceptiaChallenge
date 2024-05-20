import React from "react";
import Login from "./components/Login";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DefaultLayout from "./layout/DefaultLayout";


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