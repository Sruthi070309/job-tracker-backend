import "dotenv/config";
import mongoose from "mongoose";
import Opening from "./models/Opening.js";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const openings = [
  { type: "Job", title: "Frontend Developer", company: "Nimbus Labs", location: "Chennai", mode: "Hybrid", pay: "6-9 LPA", about: "Build responsive interfaces with React and Tailwind." },
  { type: "Job", title: "Node.js Developer", company: "Kora Softworks", location: "Remote", mode: "Remote", pay: "7-10 LPA", about: "Design REST APIs with Express and MongoDB." },
  { type: "Job", title: "Full Stack Engineer", company: "Orchid Systems", location: "Bengaluru", mode: "On-site", pay: "9-14 LPA", about: "Work across the MERN stack on a booking platform." },
  { type: "Job", title: "QA Analyst", company: "Brightwave Tech", location: "Hyderabad", mode: "Hybrid", pay: "4-6 LPA", about: "Write test cases and automate regression checks." },
  { type: "Job", title: "UI Developer", company: "Pixelforge", location: "Coimbatore", mode: "On-site", pay: "5-8 LPA", about: "Turn designs into clean, accessible web pages." },
  { type: "Job", title: "Data Analyst", company: "Greenfield Analytics", location: "Pune", mode: "Hybrid", pay: "6-8 LPA", about: "Clean datasets and build dashboards for clients." },
  { type: "Internship", title: "React Intern", company: "Nimbus Labs", location: "Chennai", mode: "Hybrid", pay: "Rs 12,000/mo", about: "Support the frontend team on real product features." },
  { type: "Internship", title: "Backend Intern", company: "Kora Softworks", location: "Remote", mode: "Remote", pay: "Rs 15,000/mo", about: "Learn Node.js and Mongoose while building endpoints." },
  { type: "Internship", title: "Web Development Intern", company: "Pixelforge", location: "Coimbatore", mode: "On-site", pay: "Rs 8,000/mo", about: "HTML, CSS and JavaScript on live client sites." },
  { type: "Internship", title: "QA Intern", company: "Brightwave Tech", location: "Hyderabad", mode: "Hybrid", pay: "Rs 10,000/mo", about: "Learn manual testing and bug reporting." },
  { type: "Internship", title: "Data Intern", company: "Greenfield Analytics", location: "Pune", mode: "Remote", pay: "Rs 10,000/mo", about: "Help prepare data and charts for weekly reports." },
  { type: "Internship", title: "UI/UX Intern", company: "Orchid Systems", location: "Bengaluru", mode: "On-site", pay: "Rs 12,000/mo", about: "Create wireframes and test them with real users." },
];

await mongoose.connect(process.env.MONGO_URI);
await Opening.deleteMany();
await Opening.insertMany(openings);
console.log("Seeded " + openings.length + " openings");
await mongoose.disconnect();
