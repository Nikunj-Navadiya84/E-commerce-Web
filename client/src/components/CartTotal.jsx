import React, { useContext } from 'react'
import { StoreContext } from '../Context/StoreContext'
import { Link } from "react-router";


function CartTotal() {
    const { getCartAmount, delivery_fee, setCartOpen } = useContext(StoreContext);

    return (
        <div className='w-full '>

            <h1 className='text-lg text-gray-700 font-semibold mb-2'>Cart Totals</h1>


            <div className='flex text-sm text-gray-700 justify-between py-3'>
                <p>SubTotal</p>
                <p>${getCartAmount().toFixed(2)}</p>
            </div>

            <hr />
            <div className='flex text-sm text-gray-700 justify-between py-3'>
                <p>Shipping Fee</p>
                <p>${delivery_fee.toFixed(2)}</p>
            </div>

            <hr />
            <div className='flex text-sm text-gray-700 justify-between py-3'>
                <p>Total</p>
                <p>${(getCartAmount() === 0 ? 0 : (getCartAmount() + delivery_fee)).toFixed(2)}</p>
            </div>

            <div className='flex gap-5 mt-3'>

                <Link to='/viewCart' ><button onClick={() => setCartOpen(false)} className="text-sm bg-gray-600 hover:bg-gray-800 text-white px-3 py-2 rounded cursor-pointer"  >View Cart</button></Link>

                <Link to='/placeOrder' ><button onClick={() => setCartOpen(false)} className="text-sm bg-gray-600 hover:bg-gray-800 text-white px-3 py-2 rounded cursor-pointer">Checkout</button></Link>

            </div>

        </div>
    )
}

export default CartTotal
