import React, { useContext } from "react";
import { FaTimes } from "react-icons/fa";
import { StoreContext } from "../Context/StoreContext";
import { CiSquareRemove } from "react-icons/ci";
import CartTotal from "./CartTotal";

const Cart = () => {
    const {
        cart,
        cartOpen,
        setCartOpen,
        updateCartQuantity,
        handleRemove,
    } = useContext(StoreContext);

    // Fallback to empty array if cart is not valid
    const safeCart = Array.isArray(cart) ? cart : [];

    return (
        <>
            {cartOpen && (
                <div
                    className="fixed inset-0 backdrop-brightness-40 z-40"
                    onClick={() => setCartOpen(false)}
                ></div>
            )}

            <div
                className={`flex flex-col fixed top-0 right-0 h-full sm:w-[50%] md:w-[40%] lg:w-[30%] xl:w-[25%] bg-white shadow-lg p-5 z-50 backdrop-blur-sm transform ${
                    cartOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 ease-in-out`}
            >
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold">Your Cart</h2>
                    <FaTimes
                        className="text-xl cursor-pointer"
                        onClick={() => setCartOpen(false)}
                    />
                </div>

                <div className="flex flex-col h-full justify-between">
                    <div>
                        {safeCart.length === 0 ? (
                            <p className="text-gray-600">Your cart is empty.</p>
                        ) : (
                            <div className="space-y-4 max-h-[50vh] overflow-y-auto">
                                {safeCart.map((product, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between border-b border-gray-200 pb-2"
                                    >
                                        <img
                                            src={`http://localhost:4000/${product.images?.[0]}`}
                                            alt=""
                                            className="w-12 h-12 rounded"
                                        />
                                        <div className="flex-1 ml-3">
                                            <h3 className="text-sm text-gray-700 mb-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-700 font-bold mb-2">
                                                ${(product.offerPrice * product.quantity).toFixed(2)}
                                            </p>

                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center text-gray-700">
                                                    <div className="flex items-center justify-center gap-4 w-25 border border-gray-200 rounded px-2 py-1">
                                                        <button
                                                            className="cursor-pointer"
                                                            onClick={() =>
                                                                product.quantity > 1 &&
                                                                updateCartQuantity(
                                                                    product,
                                                                    product.quantity - 1
                                                                )
                                                            }
                                                        >
                                                            -
                                                        </button>
                                                        <span className="text-sm">
                                                            {product.quantity}
                                                        </span>
                                                        <button
                                                            className="cursor-pointer"
                                                            onClick={() =>
                                                                updateCartQuantity(
                                                                    product,
                                                                    product.quantity + 1
                                                                )
                                                            }
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <div>
                                                    <button
                                                        className="text-red-500 text-sm cursor-pointer"
                                                        onClick={() => handleRemove(product)}
                                                    >
                                                        <CiSquareRemove className="text-2xl" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div>
                        <CartTotal />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
