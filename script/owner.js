const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "owner",
  version: "1.0.0",
  permission: 0,
  credits: "AJ Chicano",
  description: "Send owner information with video",
  category: "info",
  usages: "/owner",
  cooldowns: 5,
};

const videos = [
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
  const videoURL = videos[Math.floor(Math.random() * videos.length)];
  const filePath = path.join(__dirname, "owner_video.mp4");

  try {
    const response = await axios({
      method: "GET",
      url: videoURL,
      responseType: "stream",
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      const message = {
        body: `👑 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 👑

🔹 Name: ARI
🔹 Developer: AutoBot PH
🔹 Role: RPW Script Maker / Lead Dev
🔹 Facebook: https://www.facebook.com/61577110900436
🔹 Status: Always Active 😎

📽️ Here's a short message from the owner!`,
        attachment: fs.createReadStream(filePath),
      };

      api.sendMessage(message, event.threadID, () => {
        fs.unlinkSync(filePath); // Clean up after sending
      });
    });

    writer.on("error", (err) => {
      console.error("Failed to write video file:", err);
      api.sendMessage("❌ Error saving the video file.", event.threadID);
    });
  } catch (err) {
    console.error("Video download failed:", err);
    api.sendMessage("❌ Failed to load the video. Please try again.", event.threadID);
  }
};
