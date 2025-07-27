const axios = require('axios');

module.exports.config = {
  name: "sim",
  version: "1.0.0",
  permission: 0,
  credits: "converted by vrax | fixed by ChatGPT",
  prefix: false,
  premium: false,
  description: "Talk with SimSimi AI (toggle on/off)",
  category: "without prefix",
  usages: "[on | off | message]",
  cooldowns: 3,
  dependencies: {
    "axios": ""
  }
};

// Store ON/OFF status per thread
global.simToggle = {};

module.exports.languages = {
  "english": {
    "Input": "Please provide a message to send to Sim.\nExample: sim Hello!",
    "Response": "Error: No response from Sim API.",
    "apiError": "Error: Failed to connect to Sim API.",
    "enabled": "✅ SimSimi is now ON for this thread.",
    "disabled": "❌ SimSimi is now OFF for this thread."
  }
};

module.exports.run = async ({ api, event, args, getText }) => {
  const { threadID, messageID } = event;
  const input = args.join(" ").trim();

  if (!input) return api.sendMessage(getText("Input"), threadID, messageID);

  // Turn ON
  if (input.toLowerCase() === "on") {
    global.simToggle[threadID] = true;
    return api.sendMessage(getText("enabled"), threadID, messageID);
  }

  // Turn OFF
  if (input.toLowerCase() === "off") {
    global.simToggle[threadID] = false;
    return api.sendMessage(getText("disabled"), threadID, messageID);
  }

  // If OFF, ignore
  if (!global.simToggle[threadID]) return;

  try {
    const apiKey = "2a5a2264d2ee4f0b847cb8bd809ed34bc3309be7";
    const apiUrl = `https://simsimi.ooguy.com/sim?query=${encodeURIComponent(input)}&apikey=${apiKey}`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.respond) return api.sendMessage(getText("Response"), threadID, messageID);
    return api.sendMessage(data.respond, threadID, messageID);
  } catch (error) {
    console.error("Sim Error:", error.message);
    return api.sendMessage(getText("apiError"), threadID, messageID);
  }
};

module.exports.handleEvent = async ({ api, event }) => {
  const { threadID, body } = event;

  // Only respond if SimSimi is ON and message is not empty
  if (!body || !global.simToggle[threadID]) return;

  try {
    const apiKey = "2a5a2264d2ee4f0b847cb8bd809ed34bc3309be7";
    const apiUrl = `https://simsimi.ooguy.com/sim?query=${encodeURIComponent(body)}&apikey=${apiKey}`;
    const { data } = await axios.get(apiUrl);

    if (data && data.respond) {
      return api.sendMessage(data.respond, threadID);
    }
  } catch (error) {
    console.error("Sim handleEvent error:", error.message);
  }
};
