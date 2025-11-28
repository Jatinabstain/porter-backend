const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Porter App API is running...");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port " + port));
