import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import axios from "axios";

function Blog() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const categories = ["Snack & Spices", "Fruits", "Vegetables"];

  const handleCheckboxChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/products/list");
        if (response.data.success && Array.isArray(response.data.products)) {
          setProducts(response.data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl text-green-600 font-semibold py-5">
          B<span className="text-gray-700">log</span>
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Category Filters */}
        <div className="w-full lg:w-[250px]">
          <div className="border border-gray-200 rounded p-5">
            <h4 className="text-xl text-gray-700 font-bold mb-5">Categories</h4>
            <hr className="text-gray-200 mb-3" />
            <div>
              {categories.map((category, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onChange={() => handleCheckboxChange(category)}
                    className="mr-2"
                  />
                  <label htmlFor={category} className="text-gray-700">
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 flex-1">
          {products
            .filter(
              (product) =>
                selectedCategories.length === 0 ||
                selectedCategories.includes("All") ||
                selectedCategories.includes(product.categories)
            )
            .map((product, index) => (
              <motion.div
                key={index}
                className="cursor-pointer rounded-lg overflow-hidden shadow-sm border border-gray-100 bg-white"
                transition={{ duration: 0.9 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="overflow-hidden relative">
                  <img
                    src={`http://localhost:4000/${product.images?.[0]}`}
                    alt={product.name}
                    className="w-full h-60 object-cover transition-transform duration-300 hover:rotate-1 hover:scale-105"
                  />
                  <hr className="border-gray-200 absolute bottom-0 left-0 w-full" />
                </div>
                <div className="p-5">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">{product.categories}</p>
                    <p className="text-lg font-semibold text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Blog;
