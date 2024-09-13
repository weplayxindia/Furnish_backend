const express = require("express");


require("dotenv").config();

const PORT = process.env.PORT || 3000;
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const db = require("./config/database");
const {cloudinaryConnect} = require("./config/cloudinary");
const userRoutes = require("./routes/auth");
const categoryRoutes = require('./routes/category');
const subcategoriesRoutes = require("./routes/subcategory")
const app = express();


db.connect();
app.use(express.json());
app.use(cookieParser())

const localhost = "http://localhost:3000";
 const originUrl = "";

app.use(
    cors({
        origin: [localhost, originUrl],
        credentials: true,
    })
);

app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp",
    })
);


cloudinaryConnect();

app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/subcategory", subcategoriesRoutes);




app.listen(PORT, () => {
    console.log(`server started running in port number ${PORT}`)
})