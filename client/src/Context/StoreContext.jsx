import { createContext, useState, useEffect } from "react";
export const StoreContext = createContext();
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from 'sweetalert2';

export const ShopContextProvider = ({ children }) => {

    const [cartOpen, setCartOpen] = useState(false);
    const [cartProducts, setCartProducts] = useState({});
    const [cart, setCart] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [list, setList] = useState([]);
    const [listOpen, setListOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("token") ? true : false);
    const [user, setUser] = useState("");
    const delivery_fee = 10;
    const token = localStorage.getItem("token");
    const [likedProducts, setLikedProducts] = useState({});
    const [wishlist, setWishList] = useState([]);


    // Fetch user data
    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            return;
        }
        try {
            const response = await fetch("http://localhost:4000/api/user/users", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch user");
            const data = await response.json();
            setUser({
                UserId: data.userId,
                name: data.LoginUserName || "Unknown User",
                email: data.email || "No Email",
                profilePic: data.profilePic || null,
            });
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser()
    });

    // Keep user data in local storage updated
    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("UserId", user.UserId);
        } else {
            localStorage.removeItem("user");
            localStorage.removeItem("UserId");
        }
    }, [user]);





    // Add to Wishlist
    const addToWishlist = async (product) => {
        if (!token) {
            toast.error("User is not authenticated!");
            return;
        }

        if (!product?._id) {
            toast.error("Invalid product data!");
            return;
        }

        // Prevent duplicate wishlist entries
        if (likedProducts[product._id]) {
            toast.info("Product is already in your wishlist!");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:4000/api/wishlist/addwishlist",
                { productId: product._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setLikedProducts((prev) => ({
                    ...prev,
                    [product._id]: true,
                }));
                setWishList((prev) => [...prev, product]); // Update wishlist state
                localStorage.setItem("wishlist", JSON.stringify([...wishlist, product])); // Store updated list in localStorage
                toast.success("Added to wishlist!");
            } else {
                toast.info(response.data.message);
            }
        } catch (error) {
            console.error("Error adding to wishlist:", error.response?.data);
            if (error.response?.data?.message === "Product already in wishlist") {
                toast.info("Product is already in your wishlist!");
            } else {
                toast.error("Failed to add to wishlist");
            }
        }
    };

    // Remove from Wishlist
    const removeFromWishlist = async (product) => {
        if (!token) {
            toast.error("User not authenticated");
            return;
        }

        try {
            const response = await axios.delete(
                "http://localhost:4000/api/wishlist/removewishlist",
                {
                    data: { productId: product._id },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                setLikedProducts((prev) => {
                    const updatedWishlist = { ...prev };
                    delete updatedWishlist[product._id];
                    return updatedWishlist;
                });

                const updatedWishlist = wishlist.filter((item) => item._id !== product._id);
                setWishList(updatedWishlist);
                localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
                toast.warn("Removed from wishlist");
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
            toast.error("Failed to remove from wishlist");
        }
    };

    // Fetch Wishlist from API
    const fetchWishlist = async () => {
        try {
            if (!token) {
                console.error("No authentication token found");
                return;
            }

            const res = await axios.get("http://localhost:4000/api/wishlist/getwishlist", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true
            });

            if (res.data.success && res.data.wishlist?.products) {
                setWishList(res.data.wishlist.products);
                localStorage.setItem("wishlist", JSON.stringify(res.data.wishlist.products));
                setLikedProducts(() =>
                    res.data.wishlist.products.reduce((acc, product) => {
                        acc[product._id] = true;
                        return acc;
                    }, {})
                );
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        setWishList(savedWishlist);
        setLikedProducts(() =>
            savedWishlist.reduce((acc, product) => {
                acc[product._id] = true;
                return acc;
            }, {})
        );
    }, []);

    useEffect(() => {
        if (token) {
            fetchWishlist();
        }
    }, [token]);

    // Get Wishlist Count
    const getListCount = () => {
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        return savedWishlist.length;
    };





    // Save cart to localStorage
    const saveCartToLocalStorage = (cart) => {
        localStorage.setItem("user_cart", JSON.stringify(cart));
    };

    // Load cart from localStorage
    const loadCartFromLocalStorage = () => {
        const savedCart = localStorage.getItem("user_cart");
        if (savedCart) {
            try {
                const parsedCart = JSON.parse(savedCart);
                setCart(parsedCart);
            } catch (e) {
                console.error("Error parsing saved cart:", e);
            }
        }
    };

    // Add To Cart
    const addToCart = async (product, quantity = 1) => {
        if (!token) {
            toast.error("User is not authenticated!");
            return;
        }

        if (!product || !product._id || quantity <= 0) {
            toast.error("Invalid product data or quantity!");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:4000/api/cart/addcart",
                { productId: product._id, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                await fetchcartlist(); // refresh cart from server
                toast.success(`${quantity} item(s) added to cart!`);
            } else {
                toast.info(response.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message;

            if (errorMessage === "Not enough stock available") {
                toast.warning("Requested quantity exceeds available stock!");
            } else{
                toast.error("Product is out of stock!");
            }
        }
    };


    // Fetch Cart List
    const fetchcartlist = async () => {
        try {
            if (!token) {
                console.error("No authentication token found");
                return;
            }

            const res = await axios.get("http://localhost:4000/api/cart/getcart", {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            });

            if (res.data.success && res.data.cart?.products) {
                const productsFromCart = res.data.cart.products.map((p) => ({
                    ...p.product,
                    quantity: p.quantity || 1,
                }));

                setCart(productsFromCart);
                saveCartToLocalStorage(productsFromCart);

                const updatedCartProducts = {};
                productsFromCart.forEach((p) => {
                    updatedCartProducts[p._id] = p.quantity;
                });

                setCartProducts(updatedCartProducts);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        }
    };

    // Update Quantity
    const updateCartQuantity = async (product, newQuantity) => {
        if (!token) {
            return;
        }

        if (!product || !product._id || isNaN(newQuantity) || newQuantity < 0) {
            return;
        }

        try {
            const response = await axios.put(
                "http://localhost:4000/api/cart/updatecart",
                {
                    productId: product._id,
                    quantity: Number(newQuantity),
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                await fetchcartlist(); // Sync updated cart
            }
        } catch (error) {
            console.error(error.response?.data?.message || "Failed to update cart");
        }
    };

    // Handle Quantity Change
    const handleQuantityChange = (event) => {
        const value = Math.max(1, parseInt(event.target.value));
        setQuantity(value);
    };

    // Remove From Cart


    const handleRemove = async (product) => {
        if (!product || !product._id) {
            console.error("Invalid product passed to handleRemove:", product);
            return;
        }

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to remove this item from the cart?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, remove it!',
        });

        if (!result.isConfirmed) return;

        const token = localStorage.getItem("token");
        const prevCart = [...cart];
        const updatedCart = cart.filter((item) => item._id !== product._id);

        setCart(updatedCart);
        saveCartToLocalStorage(updatedCart);

        try {
            const response = await fetch("http://localhost:4000/api/cart/removecart", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    productId: product._id,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to remove product from cart.");
            }

            await fetchcartlist();

            // Show success popup
            Swal.fire({
                title: 'Removed!',
                text: 'Product has been removed from your cart.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });

        } catch (error) {
            console.error("Error removing product:", error.message);
            setCart(prevCart);
            saveCartToLocalStorage(prevCart);

            // Show error popup
            Swal.fire({
                title: 'Error!',
                text: 'Something went wrong while removing the product.',
                icon: 'error',
            });
        }
    };



    // Get Cart Count
    const getCartCount = () => cart.length;

    // Get Cart Amount
    const getCartAmount = () => {
        if (!Array.isArray(cart)) return 0;
        return cart.reduce((total, item) => total + item.offerPrice * item.quantity, 0);
    };

    const getOfferAmount = () => {
        if (!Array.isArray(cart)) return 0;
        return cart.reduce((total, item) => total + (item.price - item.offerPrice) * item.quantity, 0);
    };

    // useEffect on token change
    useEffect(() => {
        if (token) {
            fetchcartlist();
        } else {
            loadCartFromLocalStorage();
        }
    }, [token]);

    const clearCart = async () => {
        if (!token) {
            toast.error("User is not authenticated!");
            return;
        }

        try {
            const response = await axios.delete("http://localhost:4000/api/cart/clearcart", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setCart([]);
                setCartProducts({});
                localStorage.removeItem("user_cart");
            } else {
                toast.info(response.data.message || "Could not clear cart");
            }
        } catch (error) {
            console.error("Error clearing cart:", error.response?.data || error.message);
            toast.error("Failed to clear cart");
        }
    };



    const contextValue = {
        cart, setCart, cartOpen, setCartOpen, addToCart, quantity, updateCartQuantity, getCartCount, list, setList, listOpen, setListOpen, getListCount, getCartAmount, delivery_fee, removeFromWishlist, isLoggedIn, setIsLoggedIn, user, setUser, likedProducts, setLikedProducts, addToWishlist, fetchWishlist, wishlist, handleRemove, cartProducts, handleQuantityChange, clearCart, getOfferAmount,
    };


    return (
        <StoreContext.Provider value={contextValue}>
            {children}
        </StoreContext.Provider>
    );
};
