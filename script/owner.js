const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "owner",
  version: "1.1.0",
  permission: 0,
  credits: "AJ Chicano",
  description: "Display bot owner info with multiple videos",
  category: "info",
  usages: "/owner",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const videoUrls = [
    "https://files.catbox.moe/eksnob.mp4"
  ];

  const videoPaths = [];

  try {
    // Download all videos
    for (let i = 0; i < videoUrls.length; i++) {
      const videoUrl = videoUrls[i];
      const filePath = path.join(__dirname, "cache", `owner_video_${i}.mp4`);
      const response = await axios({ url: videoUrl, method: "GET", responseType: "stream" });

      await new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);
        writer.on("finish", resolve);
        writer.on("error", reject);
      });

      videoPaths.push(filePath);
    }

    // Create attachment array
    const attachments = videoPaths.map((file) => fs.createReadStream(file));

    // Send message
    const message = {
      body: `
👑 BOT OWNER INFO 👑

👤 Name: ARI
🌐 FACEBOOK: https://www.facebook.com/61577110900436
📍 Location: Philippines
🤖 Bot Name: AutoBot v1.0
📅 Active Since: 2024

📽 Sending multiple video files...`,
      attachment: attachments
    };

    api.sendMessage(message, event.threadID, () => {
      // Delete all videos after sending
      videoPaths.forEach((file) => fs.unlinkSync(file));
    }, event.messageID);
  } catch (error) {
    console.error("❌ Error downloading videos:", error);
    api.sendMessage("❌ Failed to send videos. Please check the video links or try again later.", event.threadID, event.messageID);
  }
};
