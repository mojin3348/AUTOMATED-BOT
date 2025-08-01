const axios = require("axios");

module.exports.config = {
  name: "hanime",
  version: "1.0.0",
  permission: 0,
  credits: "AJ Chicano",
  description: "Get hanime from API",
  category: "fun",
  usages: "[page number]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const page = args[0] || 1; // default to page 1
  const url = `https://api.raiden.ovh/hanime?page=${page}`;

  try {
    const res = await axios.get(url);
    const results = res.data.results;

    if (!results || results.length === 0) {
      return api.sendMessage(`❌ No results found for page ${page}.`, event.threadID, event.messageID);
    }

    let msg = `🔞 Hanime Results (Page ${page}):\n\n`;
    results.forEach((anime, index) => {
      msg += `#${index + 1}: ${anime.name}\nLink: ${anime.link}\n\n`;
    });

    return api.sendMessage(msg.trim(), event.threadID, event.messageID);
  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ Failed to fetch data from Hanime API.", event.threadID, event.messageID);
  }
};
