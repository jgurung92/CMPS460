

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const gameRoutes = require("./routes/gameRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/game", gameRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
