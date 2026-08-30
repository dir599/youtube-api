import express from "express";
import dotenv from "dotenv";
import prisma from "./db/prisma.js";
import cors from "cors"
import cookieParser from "cookie-parser";
import routes from "./routes/route.js"
dotenv.config()

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // allow non-browser tools (curl, Postman, server-to-server) which send no Origin header
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error(`CORS: origin ${origin} is not allowed`));
    },
    credentials: true
}))




app.use(express.json({limit: "16kb"}));
// cookie
app.use(cookieParser())


app.use(express.urlencoded({extended: true, limit: "16kb"}))

// to store images, vd etc
app.use(express.static("public"))
app.use("/api", routes)



const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("This is backend test");
});

app.listen(PORT, () => {
  console.log(`The server is running in port ${PORT}`);
});
