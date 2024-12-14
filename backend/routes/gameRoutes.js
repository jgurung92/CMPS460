
const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Start a new game
router.post("/start", async (req, res) => {
    const { username } = req.body;
    const randomNumber = Math.floor(Math.random() * 100) + 1; // Random number between 1-100

    try {
        const result = await pool.query(
            "INSERT INTO games (username, random_number, attempts) VALUES ($1, $2, $3) RETURNING id",
            [username, randomNumber, 0]
        );
        res.status(200).json({ gameId: result.rows[0].id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Submit a guess
router.post("/guess", async (req, res) => {
    const { gameId, guess } = req.body;

    try {
        const game = await pool.query("SELECT * FROM games WHERE id = $1", [gameId]);
        if (game.rows.length === 0) return res.status(404).json({ error: "Game not found" });

        const { random_number, attempts } = game.rows[0];
        let feedback;

        if (guess < random_number) feedback = "Too low!";
        else if (guess > random_number) feedback = "Too high!";
        else feedback = "Correct!";

        await pool.query("UPDATE games SET attempts = $1 WHERE id = $2", [attempts + 1, gameId]);

        res.status(200).json({ feedback, attempts: attempts + 1, isCorrect: guess == random_number });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Leaderboard
router.get("/leaderboard", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT username, attempts FROM games WHERE random_number IS NOT NULL ORDER BY attempts ASC LIMIT 10"
        );
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
