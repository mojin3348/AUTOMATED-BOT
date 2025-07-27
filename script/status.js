module.exports.config = {
  name: "status",
  version: "1.0.0",
  hasPermission: 0,
  credits: "AJ/ARI",
  description: "Displays bot status info",
  commandCategory: "utility",
  usages: "",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
  const os = require("os");
  const time = new Date().toLocaleTimeString("en-PH", { timeZone: "Asia/Manila" });
  const date = new Date().toLocaleDateString("en-PH", { timeZone: "Asia/Manila" });

  const uptimeSeconds = process.uptime();
  const uptimeHours = Math.floor(uptimeSeconds / 3600);
  const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
  const uptimeFormatted = `${uptimeHours}h ${uptimeMinutes}m`;

  const message = 
    `🤖 Autobot Status\n` +
    `────────────────────\n` +
    `📆 Date: ${date}\n` +
    `⏰ Time: ${time}\n` +
    `⚙️ Uptime: ${uptimeFormatted}\n` +
    `💾 RAM Usage: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB\n` +
    `🧠 CPU: ${os.cpus()[0].model}\n` +
    `🏓 Status: Online & Active`;

  return api.sendMessage(message, event.threadID, event.messageID);
};
