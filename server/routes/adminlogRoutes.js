const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const logger = require("../Logger/logger.js");

router.get("/logs", async (req, res) => {
    try {
        const logFilePath = path.join(__dirname, "../logger/logs/app.log");

        if (!fs.existsSync(logFilePath)) {
            return res.status(404).json({ success: false, message: "Log file not found" });
        }
        const logs = fs.readFileSync(logFilePath, "utf8")
            .split("\n")
            .filter(line => line.trim() !== "")
            .map(log => {
                try {
                    const parsedLog = JSON.parse(log);
                    return {
                        ...parsedLog,
                        username: parsedLog.username || "Unknown",
                        ip: parsedLog.ip || "N/A"
                    };
                } catch (error) {
                    return { timestamp: new Date().toISOString(), level: "error", message: "Invalid log format", raw: log };
                }
            });

        res.status(200).json({ success: true, logs });
    } catch (error) {
        logger.error("Error fetching logs", { error: error.message });
        res.status(500).json({ success: false, message: "Error fetching logs", error: error.message });
    }
});

module.exports = router;