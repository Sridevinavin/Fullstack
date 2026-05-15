const express = require('express');
const app = express();
const port = 8080;
const cors = require('cors');
const Pool = require('../database/db');

app.use(cors());
app.use(express.json());

app.get("/users", async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const [rows] = await Pool.execute("SELECT id, name, email FROM userdetails LIMIT ? OFFSET ?", [String(limit), String(offset)]);
    const [[{ total }]] = await Pool.execute("SELECT count(*)  total FROM userdetails");
    res.status(200).json({
        users: rows,
        totalCount: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
    });
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});