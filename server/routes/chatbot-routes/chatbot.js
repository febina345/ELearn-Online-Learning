
const express = require('express');
const router = express.Router();
// const chatbotController = require('../../controllers/chatbot-controller/chatbotController')

// chatbot response logic
router.post('/', (req, res) => {
    const { message } = req.body;
    const msg = message.toLowerCase();
  
    let reply = "I'm not sure how to respond to that. Can you please rephrase?";
  
    if (msg.includes("hello") || msg.includes("hi")) {
      reply = "Hi there! How can I assist you with your course today?";
    } else if (msg.includes("course") || msg.includes("my courses")) {
      reply = "You can view all your enrolled courses from your dashboard.";
    } else if (msg.includes("certificate")) {
      reply = "You’ll receive your certificate after completing the course and passing the quiz.";
    } else if (msg.includes("quiz") || msg.includes("take quiz")) {
      reply = "Sure! Here's a quick quiz: \n\n**Question:** What is React?\nA. A database\nB. A JavaScript library for building UIs\nC. A CSS framework\nD. A backend tool\n\nReply with the correct option (A, B, C, or D).";
    } else if (msg.includes("answer b")) {
      reply = "✅ Correct! React is a JavaScript library for building user interfaces.";
    } else if (msg.includes("answer")) {
      reply = " Oops! That's not correct. The correct answer is B: A JavaScript library for building UIs.";
    } else if (msg.includes("next lecture") || msg.includes("what's next")) {
      reply = "Based on your progress, your next lecture is: 'Understanding Props and State in React'. You can find it in the course curriculum.";
    } else if (msg.includes("help") || msg.includes("how does this work")) {
      reply = "I'm here to help you with course navigation, quizzes, and general questions. Just type what you're looking for!";
    } else if (msg.includes("feedback") || msg.includes("improve course")) {
      reply = "If you have feedback or suggestions to improve the course, please email your instructor or leave a review on the course page.";
    } else if (msg.includes("enrolled") || msg.includes("am i enrolled")) {
      reply = "If you're able to access course content, that means you're enrolled. Check the dashboard to confirm.";
    }else if (msg.includes("completed") || msg.includes("Can you recommend any other course? I have completed the presesnt course.")){
        reply = "Congratulations on Your course completion .There are a lot of courses available for your specefic interest . Why dont you try our next avilable course PYTHON FOR BGINNERS.";
    }
  
    res.json({ reply });
  });

// Connect route to the OpenAI-based controller
// router.post('/', chatbotController.handleChatMessage);


module.exports = router;
