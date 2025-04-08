import React, { useState, useContext, useEffect } from 'react';
import { motion } from "framer-motion";
import assets from '../assets/assets';
import { FaStar } from "react-icons/fa";
import { FaStarHalfStroke } from "react-icons/fa6";


const products = [
  {
    id: 1,
    image: assets.img1,
    category: "Snack & Spices",
    name: "Mixed Nuts Berries Pack",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1900s,",
    price: 45.00,
    Date: "June 30,2025",
    reviews: (
      <div className='flex'>
        <FaStar color="gold" />
        <FaStar color="gold" />
        <FaStar color="gold" />
        <FaStar color="gold" />
        <FaStarHalfStroke color="gold" />
      </div>
    ),
  }, {
    id: 2,
    image: assets.img2,
    category: "Snack & Spices",
    name: "Mixed Nuts Berries Pack",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1900s,",
    price: 45.00,
    Date: "June 30,2025",
    reviews: (
      <div className='flex'>
        <FaStar color="gold" />
        <FaStar color="gold" />
        <FaStar color="gold" />
        <FaStar color="gold" />
        <FaStarHalfStroke color="gold" />
      </div>
    ),
  }, {
    id: 3,
    image: assets.img3,
    category: "Fruits",
    name: "Mixed Nuts Berries Pack",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1900s,",
    price: 45.00,
    Date: "June 30,2025",
    reviews: (
      <div className='flex'>
        <FaStar color="gold" />
        <FaStar color="gold" />
        <FaStar color="gold" />
        <FaStar color="gold" />
        <FaStarHalfStroke color="gold" />
      </div>
    ),
  }, {
    id: 4,
    image: assets.img4,
    category: "Snack & Spices",
    name: "Mixed Nuts Berries Pack",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1900s,",
    price: 45.00,
    Date: "June 30,2025",
    reviews: (
      <div className='flex'>
        <FaStar color="gold" />
        <FaStar color="gold" />
        <FaStar color="gold" />
        <FaStar color="gold" />
        <FaStarHalfStroke color="gold" />
      </div>
    ),
  },
  {
    id: 5,
    image: assets.img5,
    category: "Vegetables",
    name: "Mixed Nuts Berries Pack",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry`s standard dummy text ever since the 1900s,",
    price: 45.00,
    Date: "June 30,2025",
    reviews: (
      <div className='flex'>
        <FaStar color="gold" />
        <FaStar color="gold" />
        <FaStar color="gold" />
        <FaStar color="gold" />
        <FaStarHalfStroke color="gold" />
      </div>
    ),
  },

];


function Blog() {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const categories = ["Snack & Spices", "Fruits", "Vegetables"];

  const handleCheckboxChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category]
    );
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);


  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] pb-20">
      <div className='flex items-center justify-between pt-5'>

        <h1 className='text-3xl  text-green-600 font-semibold '>B<span className=' text-gray-700'>log</span></h1>

      </div>

      <div className='flex pt-9 gap-10'>

        <div className="w-200 ">
          <div className='border border-gray-200 rounded p-5'>
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

        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 '>
          {products
            .filter((product) =>
              selectedCategories.length === 0 ||
              selectedCategories.includes("All") ||
              selectedCategories.includes(product.category)
            )
            .map((product) => (
              <motion.div
                key={product.id}
                className=' cursor-pointer rounded-lg overflow-hidden'
                transition={{ duration: 0.9 }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}>

                <div className='overflow-hidden relative'>
                  <img src={product.image} className='w-full transition-transform duration-300 hover:rotate-6 hover:scale-110' alt={product.name} />
                  <hr className='border-gray-200 absolute bottom-0 left-0 w-full' />
                </div>

                <div className='p-5'>
                  <div className='flex justify-between'>
                    <div>
                      <div className='flex text-gray-500 text-sm mb-2 gap-5 items-center'>
                        <p>{product.Date}</p>
                        <p>{product.category}</p>
                      </div>
                      <p className='text-gray-800 text-lg mb-2'>{product.name}</p>
                      <p className='text-gray-500 text-sm mb-2'>{product.description}</p>
                    </div>
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
