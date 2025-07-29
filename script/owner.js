const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "owner",
  version: "1.0.0",
  permission: 0,
  credits: "AJ Chicano",
  description: "Show info about the bot owner and send a video",
  category: "info",
  usages: "/owner",
  cooldowns: 5
};

const videoLinks = [
  "https://i.imgur.com/9LDVC57.mp4",
  "https://i.imgur.com/r7IxgiR.mp4",
  "https://i.imgur.com/J1jWubu.mp4",
  "https://i.imgur.com/v4mLGte.mp4",
  "https://i.imgur.com/qHPeKDV.mp4",
  "https://i.imgur.com/ViP4uvu.mp4",
  "https://i.imgur.com/Xf6HVcA.mp4",
  "https://i.imgur.com/ySu69zS.mp4",
  "https://i.imgur.com/ApOSepp.mp4",
  "https://i.imgur.com/dYLBspd.mp4"
];

module.exports.run = async function ({ api, event }) {
  const videoUrl = videoLinks[Math.floor(Math.random() * videoLinks.length)];
  const fileName = path.join(__dirname, "owner_video.mp4");

  try {
    const response = await axios.get(videoUrl, { responseType: "stream" });
    const writer = fs.createWriteStream(fileName);
    response.data.pipe(writer);

    writer.on("finish", () => {
      const message = {
        body: `👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 👑

• Name: ARI
• Developer: AutoBot PH Team
• Role: Main Bot Dev / RPW Script Maker
• Contact: https://www.facebook.com/profile.php?id=61577110900436

💬 Need help? Just message me!`,
        attachment: fs.createReadStream(fileName)
      };

      api.sendMessage(message, event.threadID, () => {
        fs.unlinkSync(fileName); // delete file after sending
      });
    });

    writer.on("error", (err) => {
      console.error("Download error:", err);
      api.sendMessage("❌ Failed to download the video.", event.threadID);
    });
  } catch (error) {
    console.error("Request failed:", error);
    api.sendMessage("❌ An error occurred while processing your request.", event.threadID);
  }
};
