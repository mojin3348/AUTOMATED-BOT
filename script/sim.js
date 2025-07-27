const axios = require('axios');

module.exports.config = {
  name: "sim",
  version: "1.0.0",
  permission: 0,
  credits: "converted by vrax | upgraded by ChatGPT",
  prefix: false,
  premium: false,
  description: "Talk with SimSimi AI with long memory and toggle",
  category: "without prefix",
  usages: "sim [on | off | message]",
  cooldowns: 3,
  dependencies: {
    "axios": ""
  }
};

// Store toggle and context per thread
global.simToggle = {};
global.simContext = {};

module.exports.languages = {
  "english": {
    "Input": "Please provide a message to send to Sim.\nExample: sim Hello!",
    "Response": "Error: No response from Sim API.",
    "apiError": "Error: Failed to connect to Sim API.",
    "enabled": "✅ SimSimi is now ON for this thread.",
    "disabled": "❌ SimSimi is now OFF for this thread."
  },
  "bangla": {
    "noInput": "অনুগ্রহ করে Sim-এ পাঠানোর জন্য একটি বার্তা লিখুন।\nযেমন: sim হ্যালো!",
    "noResponse": "ত্রুটি: Sim API থেকে কোনো উত্তর পাওয়া যায়নি।",
    "apiError": "ত্রুটি: Sim API এর সাথে সংযোগ ব্যর্থ হয়েছে।"
  }
};

module.exports.run = async ({ api, event, args, getText }) => {
  const { threadID, messageID } = event;
  const query = args.join(" ").trim();

  if (!query) return api.sendMessage(getText("Input"), threadID, messageID);

  // Enable SimSimi in the thread
  if (query.toLowerCase() === "on") {
    global.simToggle[threadID] = true;
    global.simContext[threadID] = []; // Initialize context
    return api.sendMessage(getText("enabled"), threadID, messageID);
  }

  // Disable SimSimi
  if (query.toLowerCase() === "off") {
    global.simToggle[threadID] = false;
    delete global.simContext[threadID];
    return api.sendMessage(getText("disabled"), threadID, messageID);
  }

  // If SimSimi not enabled
  if (!global.simToggle[threadID]) return;

  try {
    const apiKey = "2a5a2264d2ee4f0b847cb8bd809ed34bc3309be7";
    const context = global.simContext[threadID] || [];

    context.push({ role: "user", content: query });

    const apiUrl = `https://simsimi.ooguy.com/sim?query=${encodeURIComponent(query)}&apikey=${apiKey}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.respond) return api.sendMessage(getText("Response"), threadID, messageID);

    // Save bot reply to context
    context.push({ role: "bot", content: data.respond });
    if (context.length > 10) context.shift(); // Keep conversation length reasonable

    global.simContext[threadID] = context;

    return api.sendMessage(data.respond, threadID, messageID);
  } catch (error) {
    console.error("Sim error:", error.message);
    return api.sendMessage(getText("apiError"), threadID, messageID);
  }
};

// Continued conversation support
module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, body } = event;
  if (!body || !global.simToggle[threadID]) return;

  try {
    const apiKey = "2a5a2264d2ee4f0b847cb8bd809ed34bc3309be7";
    const context = global.simContext[threadID] || [];

    context.push({ role: "user", content: body });

    const apiUrl = `https://simsimi.ooguy.com/sim?query=${encodeURIComponent(body)}&apikey=${apiKey}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.respond) return;

    context.push({ role: "bot", content: data.respond });
    if (context.length > 10) context.shift();

    global.simContext[threadID] = context;

    return api.sendMessage(data.respond, threadID);
  } catch (err) {
    console.log("Sim handleEvent error:", err.message);
  }
};
