require("dotenv").config();
const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const pool = require('../database/db');

app.use(cors());
app.use(express.json());

app.get("/users", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const [rows] = await pool.execute("SELECT id, name, email FROM Userdetails LIMIT ? OFFSET ?", [String(limit), String(offset)]);
        const [[{ total }]] = await pool.execute("SELECT count(*)  total FROM Userdetails");
        res.status(200).json({
            users: rows,
            totalCount: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});