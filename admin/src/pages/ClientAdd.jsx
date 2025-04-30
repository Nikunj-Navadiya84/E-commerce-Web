import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { assets } from "../assets/assets";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function Client() {
  const location = useLocation();
  const navigate = useNavigate();
  const clientData = location.state?.client;

  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [review, setReview] = useState("");

  useEffect(() => {
    if (clientData) {
      setName(clientData.name);
      setDescription(clientData.description);
      setReview(clientData.review);

      // Handle existing image preview (assuming single image)
      if (clientData.images && clientData.images.length > 0) {
        const img = clientData.images[0];
        const path = typeof img === "string" ? img : img.url;
        const fullUrl = path.startsWith("http") ? path : `http://localhost:4000/${path}`;
        setImage(fullUrl);
      }
    }
  }, [clientData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("review", review);

    if (image instanceof File) {
      formData.append("images", image);
    }

    try {
      const token = localStorage.getItem("token");
      const url = clientData
        ? `http://localhost:4000/api/client/update/${clientData._id}`
        : "http://localhost:4000/api/client/add";
      const method = clientData ? "put" : "post";

      await axios[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(clientData ? "Client review updated successfully!" : "Client review added successfully!");

      if (clientData) {
        navigate("/clientList");
      } else {
        setName("");
        setDescription("");
        setReview("");
        setImage(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
      console.error("Error:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="main-content">
      <h1 className="text-xl shadow p-5">{clientData ? "Update Client Review" : "Add Client Review"}</h1>

      <form className="max-w-xl p-6" onSubmit={handleSubmit}>
        <div className="text-sm">
          <p className="mb-2">Upload Client Image</p>
          <label className="w-full flex flex-col px-4 py-3 border bg-white border-gray-300 rounded cursor-pointer">
            <span className="text-gray-500">Single Image Add</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          {image ? (
            <img
              className="w-20 sm:w-24 md:w-28 mt-2"
              src={image instanceof File ? URL.createObjectURL(image) : image}
              alt="Preview"
            />
          ) : (
            <img className="w-20 sm:w-24 md:w-28 mt-5" src={assets.upload_area} alt="Upload Placeholder" />
          )}
        </div>

        <div className="text-sm">
          <p className="my-2">Client Name</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
            placeholder="Type Here"
            required
          />
        </div>

        <div className="text-sm">
          <p className="my-2">Client Description</p>
          <ReactQuill
            theme="snow"
            value={description}
            onChange={setDescription}
            className="w-full text-2xl bg-white"
            placeholder="Write Content Here"
          />
        </div>

        <div className="text-sm">
          <p className="my-2">Client Reviews 0 to 5</p>
          <input
            type="number"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white"
            placeholder="Type reviews"
            required
            min="0"
            max="5"
            step="0.1"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-4 bg-black text-white rounded cursor-pointer text-md"
        >
          {clientData ? "Update Client Review" : "Add Client Review"}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
}

export default Client;
