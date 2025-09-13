import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();


//middleware
if(process.env.NODE_ENV !== "production") {
    app.use(
        cors({
            origin: "http://localhost:5173",
        })
    );
}

//parse JSON bodies 
app.use(express.json());
app.use(rateLimiter);

app.use("/api/notes", notesRoutes);

// Serve static files from the React frontend app
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

connectDB().then(() => {
    app.listen(5001, () => {
        console.log("Server started on PORT:", PORT);
    });
});

