const Order = require("../models/order");
const User = require("../models/User");
const Stripe = require('stripe');

// global variables
const currency = 'USD';
const deliveryCharge = 10

// gatway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KRY)

// placing orders using COD Method
exports.placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now()
        }
        const newOrder = new Order(orderData)
        await newOrder.save()

        await User.findByIdAndUpdate(userId, { cartData: {} })
        res.json({ success: true, message: "Order Placed" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// placing orders using Stripe Method
exports.placeOrderStripe = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;
        const { origin } = req.headers
        const orderData = {
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now()
        }
        const newOrder = new Order(orderData)
        await newOrder.save()
        const line_items = items.map((item) => ({
            price_data: {
                currency: currency,
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency: currency,
                product_data: {
                    name: 'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })
        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })
        res.json({ success: true, session_url: session.url })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// Verify Stripe
exports.verifyStripe = async (req, res) => {
    const { orderId, success, userId } = req.body
    try {
        if (success === "true") {
            await Order.findByIdAndUpdate(orderId, { payment: true });
            await User.findByIdAndUpdate(userId, { cartData: {} });
            res.json({ success: true })
        } else {
            await Order.findByIdAndUpdate(orderId);
            res.json({ success: false })
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


// All Oders data for Admin panel
exports.allOrder = async (req, res) => {
    try {
        const orders = await Order.find({})
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// All Oders data for fortend
exports.userOrder = async (req, res) => {
    try {
        const { userId } = req.body
        const orders = await Order.find({ userId })
        res.json({ success: true, orders })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// update oder startus from Admin panel
exports.updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body
        await Order.findByIdAndUpdate(orderId, { status })
        res.json({ success: true, message: 'Order status updated successfully' })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}
