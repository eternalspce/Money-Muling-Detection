import express from "express";
import cors from "cors";
import uploadRoute from "./routes/upload.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req,res)=>res.send("Fraud Detection API running"));

app.use("/upload", uploadRoute);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log("Server running on", PORT));
