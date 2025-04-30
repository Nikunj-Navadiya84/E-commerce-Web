import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ClientList() {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();


   // View Product
  const fetchClients = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/client/list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setClients(res.data.client);
      }
    } catch (error) {
      console.error("Error fetching clients:", error.response?.data || error.message);
    }
  };


  // delete Product
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:4000/api/client/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setClients(clients.filter((client) => client._id !== id));
      }
    } catch (error) {
      console.error("Error deleting client:", error.response?.data || error.message);
    }
  };


  // Update Product
  const handleUpdate = (client) => {
    navigate("/client", { state: { client } })
  };


  useEffect(() => {
    fetchClients();
  }, []);

  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-400" />);
    }
    return <div className="flex justify-center">{stars}</div>;
  };

  return (
    <div className="main-content">
      <h1 className="text-xl shadow p-5">Client Review List</h1>
      <div className="overflow-x-auto m-4">
        
        <table className="w-full min-w-[600px] border bg-white border-gray-200">

          <thead className="bg-gray-200 text-gray-700 text-md">
            <tr className="text-left md:text-center">
              <th className="py-3 px-4 w-1/12">Client Images</th>
              <th className="py-3 px-4 w-1/6">Client Name</th>
              <th className="py-3 px-4 w-1/2">Client Description</th>
              <th className="py-3 px-4">Client Reviews</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>

          <tbody className='text-sm'>

            {clients.length > 0 ? (
              clients.map((client) => (
                <tr key={client._id} className="text-left md:text-center hover:bg-gray-100">
                  <td className="py-3 w-1/12 px-4">
                    <img
                      src={client.images[0].url}
                      alt=""
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover mx-auto"
                    />
                  </td>
                  <td className="py-3 px-4 w-1/6">{client.name}</td>
                  <td className="py-3 px-4 w-1/2" dangerouslySetInnerHTML={{ __html: client.description }}></td>
                  <td className="py-3 px-4">{renderStars(client.review)}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => handleUpdate(client)} className="bg-green-700 text-white px-4 py-2 rounded cursor-pointer"> Update </button>
                      <button onClick={() => handleDelete(client._id)} className="bg-red-700 text-white px-4 py-2 rounded cursor-pointer"> Delete </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500"> No Clients Available </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ClientList;