const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "owner",
  version: "1.1.0",
  permission: 0,
  credits: "AJ/ARI",
  description: "Display bot owner info with multiple videos",
  category: "info",
  usages: "/owner",
  cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
  const videoUrls = [
    "https://files.catbox.moe/eksnob.mp4",
    "https://files.catbox.moe/l27lu3.mp4",
    "https://files.catbox.moe/4sh4f2.mp4",
    "https://files.catbox.moe/af5o24.mp4",
    "https://files.catbox.moe/i1sfb7.mp4",
    "https://files.catbox.moe/tiygtc.mp4",
    "https://files.catbox.moe/pxn6ri.mp4",
    "https://files.catbox.moe/93flm8.mp4",
    "https://files.catbox.moe/ogjrsp.mp4",
    "https://files.catbox.moe/c7iby8.mp4",
    "https://files.catbox.moe/9x5sy4.mp4"
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
      👑 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 👑   ━━━━━━━━━━━━━━━━ 
🧑‍🔧 𝗡𝗔𝗠𝗘: ᴀʀɪ  
📎 𝗔𝗚𝗘: 18 
🧍𝗚𝗘𝗡𝗗𝗘𝗥: ᴍᴀʟᴇ  
⚙️ 𝗥𝗢𝗟𝗘: ʟᴇᴀᴅ ᴅᴇᴠᴇʟᴏᴘᴇʀ ᴏꜰ ᴀᴜᴛᴏʙᴏᴛ 
🤖 𝗕𝗢𝗧 𝗩𝗘𝗥𝗦𝗜𝗢𝗡: 1.0 
💬 𝗡𝗢𝗧𝗘: ɪ'ᴍ ᴏᴘᴇɴ ᴛᴏ ꜱᴜɢɢᴇꜱᴛɪᴏɴꜱ ᴀɴᴅ ɪᴍᴘʀᴏᴠᴇᴍᴇɴᴛꜱ, ᴘᴍ ᴍᴇ ꜰᴏʀ ʜᴇʟᴘ ᴏʀ ʙᴏᴛ ᴄᴏʟʟᴀʙᴏʀᴀᴛɪᴏɴ . ━━━━━━━━━━━━━━━━

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
