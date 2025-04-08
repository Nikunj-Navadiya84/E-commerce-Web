import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { assets } from "../assets/assets";

function AwardsAdd() {
  const location = useLocation();
  const navigate = useNavigate();
  const awardsData = location.state?.awards;

  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [state, setState] = useState("");


  useEffect(() => {
    if (awardsData) {
      setName(awardsData.name);
      setCategory(awardsData.category);
      setState(awardsData.state);
      setImage(awardsData.images);
    }
  }, [awardsData]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Add & Update Awards
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("state", state)
    if (image instanceof File) {
      formData.append("images", image);
    }

    try {
      const token = localStorage.getItem("token");
      const url = awardsData
        ? `http://localhost:4000/api/awards/update/${awardsData._id}`
        : "http://localhost:4000/api/awards/add";
      const method = awardsData ? "put" : "post";

      const response = await axios[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(awardsData ? "Client review updated successfully!" : "Client review added successfully!");

      if (awardsData) {
        navigate("/awardsList");
      } else {
        setName("");
        setCategory("");
        setState("");
        setImage(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      console.error("Error:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="main-content">
      <h1 className="text-xl shadow p-5">{awardsData ? "Update Awards" : "Add Awards"}</h1>

      <form className="max-w-xl p-6" onSubmit={handleSubmit}>

        <div className="text-sm">
          <p className="mb-2">Upload Awards Image</p>
          <label className="w-full flex flex-col px-4 py-3 border border-gray-300 rounded cursor-pointer bg-white">
            <span className="text-gray-500">Single Image Add</span>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          {image ? (
            <img className="w-20 sm:w-24 md:w-28 mt-2"
              src={image instanceof File ? URL.createObjectURL(image) : `http://localhost:4000/${image}`}
              alt="Preview" />
          ) : (
            <img className="w-20 sm:w-24 md:w-28 mt-5" src={assets.upload_area} alt="Upload Placeholder" />
          )}
        </div>

        <div className="text-sm">
          <p className="my-2">Awards Name</p>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white" placeholder="Type Here" required />
        </div>

        <div className="text-sm">
          <p className="my-2">Awards Category</p>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white" placeholder="Type reviews" required />
        </div>

        <div className="text-sm">
          <p className="my-2">State / Country</p>
          <input type="text" value={state} onChange={(e) => setState(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white" placeholder="Type reviews" required />
        </div>

        <button type="submit" className="w-full py-3 mt-4 bg-black text-white rounded cursor-pointer text-md">
          {awardsData ? "Update Awards" : "Add Awards"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}

export default AwardsAdd;

