// require("dotenv").config();
// const OpenAI = require("openai");
// const User = require('../../models/User'); // Assuming you have a User model
// const Course = require('../../models/Course'); // Assuming you have a Course model

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // This function will handle chat messages and apply logic based on user context.
// exports.handleChatMessage = async (req, res) => {
//   const { _id, message } = req.body;

//   try {
//     // Fetch user data (e.g., enrolled courses, progress) for personalized responses
//     const user = await User.findById(_id).populate('courses'); // Assuming courses are stored in the User model
//     const responseMessage = await getChatbotResponse(message, user);

//     res.json({ reply: responseMessage });
//   } catch (error) {
//     console.error("Error handling message:", error.message);
//     res.status(500).json({ reply: "Sorry, I'm having trouble right now." });
//   }
// };

// // This function processes the message and returns an appropriate reply.
// const getChatbotResponse = async (message, user) => {
//   // Handle queries based on message content
//   const lowerMessage = message.toLowerCase();
  
//   // Generic questions
//   if (lowerMessage.includes("hello")) {
//     return "Hi there! How can I assist you with your course?";
//   }
//   if (lowerMessage.includes("courses") || lowerMessage.includes("course")) {
//     return `You are currently enrolled in the following courses: ${user.courses.map(course => course.name).join(', ')}. Would you like to know more about any specific course?`;
//   }

//   // Quiz-related questions
//   if (lowerMessage.includes("quiz") || lowerMessage.includes("test")) {
//     return "Would you like to take a short quiz to test your knowledge? I can help with that!";
//   }

//   // Course progress and next lecture suggestion
//   if (lowerMessage.includes("next lecture") || lowerMessage.includes("progress")) {
//     const nextLecture = await getNextLecture(user);
//     return nextLecture ? `Based on your progress, you can now watch the next lecture: "${nextLecture.title}". Keep up the great work!` : "You have completed all the available lectures. Congratulations!";
//   }

//   // Log the query for instructor's review
//   logCommonQuery(message);

//   // Default OpenAI response for general queries
//   const openAIResponse = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [
//       {
//         role: "system",
//         content: "You are a helpful chatbot assistant for an E-learning platform. Always be polite and contextual.",
//       },
//       { role: "user", content: message },
//     ],
//   });

//   return openAIResponse.choices[0].message.content;
// };

// // Fetch next lecture based on the student's progress
// const getNextLecture = async (user) => {
//   const lastCourse = user.courses[user.courses.length - 1];
//   const lastLectureIndex = lastCourse.completedLectures.length; // Assuming completedLectures stores user's progress

//   if (lastLectureIndex < lastCourse.lectures.length) {
//     return lastCourse.lectures[lastLectureIndex];
//   }
//   return null;
// };

// // Log common queries to improve course content
// const logCommonQuery = (query) => {
//   // Implement logic to log or track queries in a database or file
//   console.log("Common Query Logged: ", query);
// };
