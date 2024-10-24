const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
const userRoutes = require("./routes/auth");
const categoryRoutes = require('./routes/category');
const subcategoriesRoutes = require("./routes/subcategory");
const searchRoutes = require("./routes/search");
const productsRoutes = require("./routes/products");
const orderRoutes = require("./routes/order");
const uploadRoute = require("./routes/upload");
const paymentRoute = require("./routes/payment")
const contactRoute = require("./routes/contactUs")
const app = express();
const path = require("path");

db.connect();

app.use(cors({
    origin: [process.env.ORIGIN_URL, ""], 
    credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, 'public')));

cloudinaryConnect();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/subcategory", subcategoriesRoutes);
app.use("/api/v1/product", productsRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/upload", uploadRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/contact",contactRoute)


// Start server
app.listen(PORT, () => {
    console.log(`Server started running on port ${PORT}`);
});
