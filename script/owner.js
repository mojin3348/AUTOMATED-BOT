const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "owner",
  version: "2.0.0",
  permission: 0,
  credits: "AJ Chicano",
  description: "Show bot owner info with multiple videos",
  category: "info",
  usages: "/owner",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event }) {
  try {
    const folderPath = path.join(__dirname, "cache", "owner-videos");

    // Check if folder exists
    if (!fs.existsSync(folderPath)) {
      return api.sendMessage(
        "❌ Folder 'owner-videos' not found in /cache. Please create it and add videos.",
        event.threadID,
        event.messageID
      );
    }

    // Get all .mp4 files
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith("https://i.imgur.com/20QmmsT.mp4",
										"https://i.imgur.com/nN28Eea.mp4",
										"https://i.imgur.com/fknQ3Ut.mp4",
										"https://i.imgur.com/yXZJ4A9.mp4",
										"https://i.imgur.com/GnF9Fdw.mp4",
										"https://i.imgur.com/B86BX8T.mp4",
										"https://i.imgur.com/kZCBjkz.mp4",
										"https://i.imgur.com/id5Rv7O.mp4",
										"https://i.imgur.com/aWIyVpN.mp4",
										"https://i.imgur.com/aFIwl8X.mp4",
										"https://i.imgur.com/SJ60dUB.mp4",
										"https://i.imgur.com/ySu69zS.mp4",
										"https://i.imgur.com/mAmwCe6.mp4",
										"https://i.imgur.com/Sbztqx2.mp4",
										"https://i.imgur.com/s2d0BIK.mp4",
										"https://i.imgur.com/rWRfAAZ.mp4",
										"https://i.imgur.com/dYLBspd.mp4",
										"https://i.imgur.com/HCv8Pfs.mp4",
										"https://i.imgur.com/jdVLoxo.mp4",
										"https://i.imgur.com/hX3Znez.mp4",
										"https://i.imgur.com/cispiyh.mp4",
										"https://i.imgur.com/ApOSepp.mp4",
										"https://i.imgur.com/lFoNnZZ.mp4",
										"https://i.imgur.com/qDsEv1Q.mp4",
										"https://i.imgur.com/NjWUgW8.mp4",
										"https://i.imgur.com/ViP4uvu.mp4",
										"https://i.imgur.com/bim2U8C.mp4",
										"https://i.imgur.com/YzlGSlm.mp4",
										"https://i.imgur.com/HZpxU7h.mp4",
										"https://i.imgur.com/exTO3J4.mp4",
										"https://i.imgur.com/Xf6HVcA.mp4",
										"https://i.imgur.com/9iOci5S.mp4",
										"https://i.imgur.com/6w5tnvs.mp4",
										"https://i.imgur.com/1L0DMtl.mp4",
										"https://i.imgur.com/7wcQ8eW.mp4",
										"https://i.imgur.com/3MBTpM8.mp4",
										"https://i.imgur.com/8h1Vgum.mp4",
										"https://i.imgur.com/CTcsUZk.mp4",
										"https://i.imgur.com/e505Ko2.mp4",));

    if (files.length === 0) {
      return api.sendMessage(
        "⚠️ No videos found in /cache/owner-videos.",
        event.threadID,
        event.messageID
      );
    }

    // Create streams for all videos
    const attachments = files.map(file => fs.createReadStream(path.join(folderPath, file)));

    const ownerInfo = `
👤 𝗕𝗢𝗧 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 👤
━━━━━━━━━━━━━━━
• Name: ARI
• Fb: https://www.facebook.com/61577110900436
• Autobot: https://automated-bot-nfyh.onrender.com
• Role: Developer
━━━━━━━━━━━━━━━
📹 Sending ${attachments.length} video(s)...
`.trim();

    // Send message with all video attachments
    api.sendMessage(
      {
        body: ownerInfo,
        attachment: attachments,
      },
      event.threadID,
      event.messageID
    );
  } catch (error) {
    console.error("❌ Error in owner command:", error);
    api.sendMessage("❌ Error sending owner videos.", event.threadID, event.messageID);
  }
};
