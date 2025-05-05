import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './componets/PrivateRoute';
import Sidebar from './componets/SideBar';
import Navbar from './componets/Navbar';
import Dashboards from './pages/Dashboards';
import Add from './pages/ProductAdd';
import List from './pages/ProductList';
import AdminLogs from './pages/AdminLogs';
import Order from './pages/Order';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import User from './pages/User';
import UserOrder from './pages/UserOrder';


function App() {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");

  return (
    <div className='min-h-screen'>
      <ToastContainer />
      <BrowserRouter>
        <div className="flex">
          <Sidebar isOpen={isOpen} />
          <div className="flex-1">
            <Navbar setIsOpen={setIsOpen} />
            <Routes>
              <Route path="/" element={token ? <Navigate to="/dashboards" /> : <Login />} />

              <Route path="/dashboards" element={
                <PrivateRoute>
                  <Dashboards />
                </PrivateRoute>
              } />

              <Route path="/add" element={
                <PrivateRoute>
                  <Add />
                </PrivateRoute>
              } />

              <Route path="/list" element={
                <PrivateRoute>
                  <List />
                </PrivateRoute>
              } />

              <Route path="/order" element={
                <PrivateRoute>
                  <Order />
                </PrivateRoute>
              } />

              <Route path="/user" element={
                <PrivateRoute>
                  <User />
                </PrivateRoute>
              } />

              <Route path="/userOrder/:userId" element={
                <PrivateRoute>
                  <UserOrder />
                </PrivateRoute>
              } />

              <Route path="/logs" element={
                <PrivateRoute>
                  <AdminLogs />
                </PrivateRoute>
              } />

            </Routes>

          </div>

        </div>

      </BrowserRouter>

    </div>
  );
}

export default App;
