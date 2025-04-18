import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Header from './components/Header'
import Footer from './components/Footer'
import Viewcart from './pages/Viewcart'
import WishList from './pages/WishList'
import Login from './pages/Login'
import ChangePassword from './pages/ChangePassword'
import PlaceOrder from './pages/PlaceOrder'
import Categories from './pages/Categories'
import Blog from './pages/blog'
import About from './pages/About'
import Offers from './pages/Offers'
import OrderConfirmation from './pages/OrderConfirmation'
import Profile from './pages/Profile'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <div >
      <ToastContainer />
      <BrowserRouter>
        <Navbar />
        <Header />
        <hr className='border-gray-300' />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/categories' element={<Categories />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/about' element={<About />} />
          <Route path='/offers' element={<Offers />} />
          <Route path='/viewCart' element={<Viewcart />} />
          <Route path='/placeOrder' element={<PlaceOrder />} />
          <Route path='/orderConfirmation' element={<OrderConfirmation />} />
          <Route path='/wishlist' element={<WishList />} />
          <Route path='/login' element={<Login />} />
          <Route path='/changepassword' element={<ChangePassword />} />
          <Route path='/profile' element={<Profile />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}


export default App
