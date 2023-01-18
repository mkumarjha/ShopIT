const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors'); 


// create a new Order => /api/v1/order/new  
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        paymentInfo,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        paymentInfo,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        payedAt: Date.now(),
        user: req.user._id
    });

    res.status(200).json({
        status:true,
        order
    });
});

// Get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next)=>{
    const order = await Order.findById(req.params.id).populate('user','name email');
    if(!order){
        return next(new ErrorHandler('No order found with this id',404));
    }
    res.status(200).json({
        status:true,
        order
    });
})

// Get logged in user orders => /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next)=>{
    const orders = await Order.find({ user: req.user._id });
    
    res.status(200).json({
        status:true,
        orders
    });
})

// Get all orders - ADMIN => /api/v1/admin/orders
exports.allOrders = catchAsyncErrors(async (req, res, next)=>{
    const orders = await Order.find({});
    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });


    res.status(200).json({
        status:true,
        totalAmount,
        orders
    });
})

// Update / Process order - ADMIN => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler('No order found with this id',404));
    }
    
    if(order.orderStatus ==='Delivered'){
        return next(new ErrorHandler('This order is already delivered',400));
    }
    
    order.orderItems.forEach(async item=>{
        await updateStock(item.product, item.quantity)
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
        status:true
    });
})

async function updateStock(id, quantity){
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false });
}


// Delete order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next)=>{
    const order = await Order.findById(req.params.id);
    if(!order){
        return next(new ErrorHandler('No order found with this id',404));
    }

    await order.remove();

    res.status(200).json({
        status:true
    });
})