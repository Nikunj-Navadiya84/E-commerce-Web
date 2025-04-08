import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function AwardsList() {
  const [awards, setAwards] = useState([]);
  const navigate = useNavigate();


  // View Product
  const fetchAwards = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/awards/list", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setAwards(res.data.awards);
      }
    } catch (error) {
      console.error("Error fetching awards:", error.response?.data || error.message);
    }
  };


  // delete Product
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:4000/api/awards/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setAwards(awards.filter((award) => award._id !== id));
      }
    } catch (error) {
      console.error("Error deleting Award:", error.response?.data || error.message);
    }
  };


  // Update Product
  const handleUpdate = (awards) => {
    navigate("/awards", { state: { awards } })
  };

  useEffect(() => {
    fetchAwards();
  }, []);


  return (
    <div className="main-content">
      <h1 className="text-xl shadow p-5">Awards List</h1>
      <div className="overflow-x-auto m-4">

        <table className="w-full min-w-[600px] border bg-white border-gray-200">
          <thead className="bg-gray-200 text-gray-700 text-md">
            <tr className="text-left md:text-center">
              <th className="py-3 px-4 w-1/12">Awards Images</th>
              <th className="py-3 px-4 w-1/4">Awards Name</th>
              <th className="py-3 px-4 w-1/4">Awards Category</th>
              <th className="py-3 px-4">State / Country</th>
              <th className="py-3 px-4">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {awards.length > 0 ? (
              awards.map((award) => (
                <tr key={award._id} className="text-left md:text-center hover:bg-gray-100">
                  <td className="py-3 w-1/12 px-4">
                    <img
                      src={`http://localhost:4000/${award.images}`}
                      alt={award.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover mx-auto"
                    />
                  </td>
                  <td className="py-3 px-4 w-1/6">{award.name}</td>
                  <td className="py-3 px-4">{award.category}</td>
                  <td className="py-3 px-4">{award.state}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => handleUpdate(award)} className="bg-green-700 text-white px-4 py-2 rounded cursor-pointer"> Update </button>
                      <button onClick={() => handleDelete(award._id)} className="bg-red-700 text-white px-4 py-2 rounded cursor-pointer"> Delete </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No Awards Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AwardsList;
