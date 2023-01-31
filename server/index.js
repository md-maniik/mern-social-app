import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"
import errorHandler from "./middlewares/errorHandler.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); 



// FILE STORAGE
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
})

const upload = multer({storage})

// ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), authRoutes);

// ROUTES
app.use("/auth", authRoutes)


app.use(errorHandler);

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGO_URL)
    .then(()=> {
        app.listen(PORT, () => {
            console.log("Backend server running in port " + PORT);
        })
    })
    .catch((err) => {
        console.log(err);
    })

