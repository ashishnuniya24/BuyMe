const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("BuyMe API is running 🚀");
});

app.get("/db-test", async (req, res) => {
    try {
        const db = require("./db");
        const result = await db.query("SELECT NOW()");
        res.json({
            message: "Database connected ✅",
            time: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            message: "Database failed ❌",
            error: err.message
        });
    }
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});