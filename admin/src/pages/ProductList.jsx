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

    if (sortOrder === "asc") {
      filtered = [...filtered].sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      filtered = [...filtered].sort((a, b) => b.price - a.price);
    }

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

      <div className='m-4 '>
        <div className="my-4 flex flex-col lg:flex-row justify-between items-center gap-4 text-sm">
          <input
            type="text"
            placeholder="Search by Name or Price..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded-md w-full lg:w-1/3 bg-white text-sm"
          />

          <select
            className="px-3 py-2 border rounded-md w-full lg:w-1/4 bg-white cursor-pointer"
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
          >
            <option value="default">Default Price</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>

          <select
            className="px-3 py-2 border rounded-md w-full lg:w-1/4 bg-white cursor-pointer"
            onChange={(e) => setStatusFilter(e.target.value)}
            value={statusFilter}
          >
            <option value="all">All Status</option>
            <option value="available">Available Stock</option>
            <option value="outofstock">Out of Stock</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-full border bg-white border-gray-200">
            <thead className="bg-gray-200 text-gray-700 text-xs sm:text-sm">
              <tr className="text-left text-xs sm:text-center">
                <th className="py-3 px-2">Image</th>
                <th className="py-3 px-2">Product Name</th>
                <th className="py-3 px-2">Categories</th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2 hidden md:table-cell">Weight</th>
                <th className="py-3 px-2">Price</th>
                <th className="py-3 px-2 hidden md:table-cell">Discount</th>
                <th className="py-3 px-2">Offer</th>
                <th className="py-3 px-2">Qty</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2">Action</th>
              </tr>
            </thead>

            <tbody className='text-xs sm:text-sm'>
              {filteredList.length > 0 ? (
                filteredList.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="py-2 px-2 text-center">
                      <img
                        className="w-14 h-14 object-cover mx-auto"
                        src={item.images[0].url}
                        alt={item.name}
                      />
                    </td>
                    <td className="py-2 px-2 text-center">{item.name}</td>
                    <td className="py-2 px-2 text-center">{item.categories}</td>
                    <td className="py-2 px-2 text-center ">{item.description}</td>
                    <td className="py-2 px-2 text-center hidden md:table-cell">{item.weight}</td>
                    <td className="py-2 px-2 text-center line-through">${item.price.toFixed(2)}</td>
                    <td className="py-2 px-2 text-center hidden md:table-cell">{item.discountPercentage}%</td>
                    <td className="py-2 px-2 text-center">${(item.offerPrice || 0).toFixed(2)}</td>
                    <td className="py-2 px-2 text-center">{item.quantity}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`inline-block w-28 text-center px-3 py-2 rounded text-white text-xs sm:text-sm ${item.quantity > 0 ? "bg-green-600" : "bg-red-300"}`}>
                        {item.quantity > 0 ? "Available" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center">
                      <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
                        <RxUpdate
                          onClick={() => handleUpdate(item)}
                          className="text-lg sm:text-xl text-green-700 cursor-pointer"
                        />
                        <MdDeleteForever
                          onClick={() => removeProduct(item._id)}
                          className="text-xl sm:text-2xl text-red-700 cursor-pointer"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center text-gray-500 p-4"> No products found </td>
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
