
const express = require('express');
const router = express.Router();

// chatbot response logic
router.post('/', (req, res) => {
    const { message } = req.body;

    let reply = "I'm not sure how to respond to that.";

    if (message.toLowerCase().includes("hello")) {
        reply = "Hi there! How can I assist you with your course?";
    } else if (message.toLowerCase().includes("course")) {
        reply = "You can view your courses from the dashboard.";
    } else if (message.toLowerCase().includes("certificate")) {
        reply = "You’ll receive your certificate after completing the course and quiz!";
    }

    res.json({ reply });
});

module.exports = router;
