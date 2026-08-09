import express from "express";
import dotenv from "dotenv";
import prisma from "./db/prisma.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import routes from "./routes/route.js";
dotenv.config()

const app = express();
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}))



app.use(express.json({limit: "16kb"}));
app.use("/api", routes)

app.use(express.urlencoded({extended: true, limit: "16kb"}))
// to store images, vd etc
app.use(express.static("public"))
// cookie
app.use(cookieParser())



const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("This is backend test");
});

app.listen(PORT, () => {
  console.log(`The server is running in port ${PORT}`);
});
