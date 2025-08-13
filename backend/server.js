const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDb = require("./config/db");
const userRoutes = require("./Routes/userRoutes");
const productRoutes = require("./Routes/productRoutes");
const cartRoutes = require("./Routes/cartRoutes");
const checkoutRoutes = require("./Routes/checkoutRoutes");
const orderRoutes = require("./Routes/orderRoutes");
const uploadRoutes = require("./Routes/uploadRoutes");
const subscriberRoutes = require("./Routes/subscriberRoutes")
const adminRoutes = require("./Routes/adminRoutes");
const productAdminRoutes = require("./Routes/productAdminRoutes");
const adminOrderRoutes = require("./Routes/adminOrderRoutes");


const app = express();


app.use(express.json());
app.use(cors());

dotenv.config();

                                                                      
const PORT  = process.env.PORT || 3000;

// Connect to MongoDB
connectDb();



app.get("/",(req,res) =>{
    res.send("Welcome to HappyCart API!");
})

// API routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload",uploadRoutes);
app.use("/api",subscriberRoutes);

//Admin  Api
app.use("/api/admin/users",adminRoutes);
app.use("/api/admin/products",productAdminRoutes);
app.use("/api/admin/orders",adminOrderRoutes);


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});


 //vq1UtqZif4GiXF2F == Password