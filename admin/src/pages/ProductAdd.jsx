import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Add = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [productId, setProductId] = useState(null);
  const [images, setImages] = useState([]);
  const [removedImages, setRemovedImages] = useState([]);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState("")
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("")
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [status, setStatus] = useState("Available");
  const [loading, setLoading] = useState(false);
  const [discountPercentage, setDiscountPercentage] = useState("");


  useEffect(() => {
    if (location.state) {
      const product = location.state;
      setProductId(product._id);
      setName(product.name);
      setCategories(product.categories)
      setDescription(product.description);
      setWeight(product.weight);
      setPrice(product.price);
      setQuantity(product.quantity);
      setDiscountPercentage(product.discountPercentage);
      setStatus(product.quantity === 0 ? "Out of Stock" : "Available");
      setImages(
        product.images.map((img) => {
          const path = typeof img === "string" ? img : img.url;
          return {
            preview: path.startsWith("http") ? path : `http://localhost:4000/${path}`,
            isExisting: true,
            originalPath: path,
          };
        })
      );
    }
  }, [location.state]);

  const onDrop = (acceptedFiles) => {
    const newImages = acceptedFiles.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file), isExisting: false })
    );
    setImages([...images, ...newImages]);
  };

  const removeImage = (index) => {
    setImages((prevImages) => {
      const removedImage = prevImages[index];
      if (removedImage.isExisting) {
        setRemovedImages((prev) => [...prev, removedImage.originalPath]);
      }
      return prevImages.filter((_, i) => i !== index);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
    multiple: true,
  });

  // PriceChange
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && /^[0-9]*$/.test(value))) {
      setPrice(value);
    }
  };

  // DiscountChange
  const handleDiscountChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && Number(value) <= 100 && /^[0-9]*$/.test(value))) {
      setDiscountPercentage(value);
    }
  };

  // QuantityChange
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "" || (Number(value) >= 0 && /^[0-9]*$/.test(value))) {
      setQuantity(value);
      setStatus(value === "0" || value === "" ? "Out of Stock" : "Available");
    }
  };

  // Add Product
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!name || !description || !categories || !weight || !price || images.length === 0) {
      toast.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("categories", categories)
    formData.append("description", description);
    formData.append("weight", weight);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("status", status);
    formData.append("discountPercentage", discountPercentage);
    removedImages.forEach((img) => formData.append("removedImages", img));
    images.forEach((image) => {
      if (!image.isExisting) {
        formData.append("images", image);
      }
    });

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = productId
        ? `http://localhost:4000/api/products/update/${productId}`
        : "http://localhost:4000/api/products/add";
      const method = productId ? "put" : "post";

      await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      toast.success(`Product ${productId ? "updated" : "added"} successfully!`);
      if (productId) {
        navigate("/list");
      } else {
        setName("");
        setCategories("");
        setDescription("");
        setWeight("");
        setPrice("");
        setQuantity("");
        setStatus("Available");
        setImages([]);
        setDiscountPercentage("");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <h1 className="text-xl shadow p-5">{productId ? "Update Product" : "Add Product"}</h1>
      <ToastContainer position="top-right" autoClose={3000} />

      <form onSubmit={onSubmitHandler} className="xl:w-[50%] md:w-full p-6 ">
        <div className="flex flex-col md:flex-row gap-6">

          {/* Left Section */}
          <div className="w-full md:w-1/2 flex flex-col gap-4 text-sm">
            <div>

              <p className="mb-2">Upload Images</p>
              <div {...getRootProps()} className="border-dashed border-2 p-6 w-full text-center cursor-pointer bg-white">
                <input {...getInputProps()} />
                <p>Single and multiple Image Upload</p>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <div key={index} className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
                      <img src={image.preview} alt="" className="w-full h-full object-cover rounded-lg shadow-md" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 text-xs rounded">✕
                      </button>
                    </div>
                  ))
                ) : (
                  <img className="w-20 sm:w-24 md:w-28 " src={assets.upload_area} alt="Upload Placeholder" />
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm">Product Name</p>
              <input onChange={(e) => setName(e.target.value)} value={name} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white" type="text" placeholder="Type Here" required />
            </div>

            <div>
              <p className="mb-2 text-sm">Product Description</p>
              <textarea onChange={(e) => setDescription(e.target.value)} value={description} className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none bg-white" placeholder="Write Content Here" required />
            </div>

          </div>

          {/* Right Section */}
          <div className="w-full md:w-1/2 flex flex-col text-sm">

            <p className="mb-2">Categories</p>
            <select onChange={(e) => setCategories(e.target.value)} value={categories} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white mb-4" required>
              <option value="">Select Category</option>
              <option value="Snack & Spices">Snack & Spices</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
            </select>

            <p className="mb-2">weight</p>
            <select onChange={(e) => setWeight(e.target.value)} value={weight} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white mb-4" required>
              <option value="">Select Weight</option>
              <option value="500 Gm">500 Gm</option>
              <option value="1 Kg">1 Kg</option>
              <option value="2 Kg">2 Kg</option>
              <option value="5 Kg">5 Kg</option>
              <option value="10 Kg">10 Kg</option>
            </select>

            <p className="mb-2">Product Price</p>
            <input onChange={handlePriceChange} value={price} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white mb-4" type="number" placeholder="Enter Price" required />

            <p className="mb-2">Discount Percentage</p>
            <input onChange={handleDiscountChange} value={discountPercentage} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white mb-4" type="number" max="100" placeholder="Enter Discount Percentage" required />

            <p className="mb-2">Product Quantity</p>
            <input onChange={handleQuantityChange} value={quantity} className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white m" type="number" placeholder="Enter Quantity" required />

          </div>

        </div>

        <button type="submit" className="lg:w-[48.4%] w-full py-3 mt-4 bg-black text-white rounded cursor-pointer text-md" disabled={loading}>
          {loading ? (productId ? "Updating..." : "Adding...") : productId ? "Update Product" : "Add Product"}
        </button>

      </form>
    </div>
  );
};

export default Add;
