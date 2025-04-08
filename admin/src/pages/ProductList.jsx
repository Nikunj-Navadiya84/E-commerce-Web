import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { RxUpdate } from "react-icons/rx";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const List = () => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [statusFilter, setStatusFilter] = useState("all");
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  
  // View Product
  const fetchList = async () => {
    try {
      if (!token) return;

      const response = await axios.get('http://localhost:4000/api/products/list', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setList(response.data.products);
        setFilteredList(response.data.products);
      } else {
        setList([]);
        setFilteredList([]);
      }
    } catch (error) {
      setList([]);
      setFilteredList([]);
    }
  };


  // delete Product
  const removeProduct = async (id) => {
    try {
      if (!token) return;

      const response = await axios.delete(`http://localhost:4000/api/products/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.error("Product deleted successfully");
        fetchList();
      }
    } catch (error) {
      toast.error("Error deleting product");
    }
  };


  // Update Product
  const handleUpdate = (product) => {
    navigate('/add', { state: product });
  };


  useEffect(() => {
    fetchList();
  }, []);


  useEffect(() => {
    let filtered = list.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.price.toString().includes(search)
    );


    // Apply price sorting
    if (sortOrder === "asc") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }


    // Apply status filter
    if (statusFilter === "available") {
      filtered = filtered.filter(item => item.quantity > 0);
    } else if (statusFilter === "outofstock") {
      filtered = filtered.filter(item => item.quantity === 0);
    }

    setFilteredList(filtered);
  }, [search, sortOrder, statusFilter, list]);

  return (
    <div className='main-content'>
      <p className='text-xl shadow p-5'>All Products</p>

      <div className='m-4'>
        {/* Search & Sorting Controls */}
        <div className="my-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <input type="text" placeholder="Search by Name or Price..." value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-2 border rounded-md w-full md:w-1/4 bg-white" />

          <select className="px-3 py-2 border rounded-md w-full md:w-1/4 bg-white cursor-pointer" onChange={(e) => setSortOrder(e.target.value)} value={sortOrder} >
            <option value="default">Default Price</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>

          <select className="px-3 py-2 border rounded-md w-full md:w-1/4 bg-white cursor-pointer" onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
            <option value="all">All Status</option>
            <option value="available">Available Stock</option>
            <option value="outofstock">Out of Stock</option>
          </select>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[600px] border bg-white border-gray-200">

            <thead className="bg-gray-200 text-gray-700 text-md">
              <tr className="text-left md:text-center">
                <th className="py-3 px-4 w-1/12">Image</th>
                <th className="py-3 px-4 w-1/6">Product Name</th>
                <th className="py-3 px-4 w-1/6">Categories</th>
                <th className="py-3 px-4 w-1/3">Product Description</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">OfferPrice</th>
                <th className="py-3 px-4">Quantity</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>

            <tbody className='text-sm'>

              {filteredList.length > 0 ? (
                filteredList.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">

                    <td className="py-2 px-4 text-center w-1/12"><img className="w-14 h-14 sm:w-16 sm:h-16 object-cover mx-auto" src={`http://localhost:4000/${item.images?.[0]}`} alt={item.name} /></td>

                    <td className="py-2 px-4 text-center w-1/6">{item.name}</td>
                    <td className="py-2 px-4 text-center w-1/6">{item.categories}</td>
                    <td className="py-2 px-4 text-center w-1/2">{item.description}</td>
                    <td className="py-2 px-4 text-center">{item.weight}</td>
                    <td className="py-2 px-4 line-through">${item.price.toFixed(2)}</td>
                    <td className="py-2 px-4 text-center">{item.discountPercentage}%</td>
                    <td className="py-2 px-4 text-center">${(item.offerPrice || 0).toFixed(2)}</td>
                    <td className="py-2 px-4 text-center">{item.quantity}</td>

                    <td className="py-2 px-4 ">
                      <button className={`px-4 py-2 w-30 rounded text-white ${item.quantity > 0 ? "bg-green-600" : "bg-red-300"}`}>
                        {item.quantity > 0 ? "Available" : "Out of Stock"}
                      </button>
                    </td>

                    <td className="py-2 px-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <RxUpdate onClick={() => handleUpdate(item)} className="text-xl sm:text-2xl text-green-700 cursor-pointer" />
                        <MdDeleteForever onClick={() => removeProduct(item._id)} className="text-2xl sm:text-3xl text-red-700 cursor-pointer" />
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-gray-500 p-4"> No products found </td>
                </tr>
              )}
            </tbody>

          </table>

        </div>

      </div>

      <ToastContainer />
    </div>
  );
};

export default List;
