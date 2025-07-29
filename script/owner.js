const axios = require("axios");
const fs = require("fs");
const path = require("path");
const os = require("os");

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

module.exports.run = async function ({ api, event }) {
  const ownerInfo = {
    name: "ARI",
    uid: "61577110900436",
    facebook: "https://facebook.com/61577110900436"
  };

  const message = 
`👑 𝘽𝙤𝙩 𝙊𝙬𝙣𝙚𝙧 𝙄𝙣𝙛𝙤 👑

📛 Name: ${ownerInfo.name}
🆔 UID: ${ownerInfo.uid}
🌐 Facebook: ${ownerInfo.facebook}

📽 Sending a video...`;

  const videoLinks = [
    "https://i.imgur.com/9LDVC57.mp4",
    "https://i.imgur.com/r7IxgiR.mp4", 
    "https://i.imgur.com/J1jWubu.mp4", 
    "https://i.imgur.com/DJylTiy.mp4", 
    "https://i.imgur.com/v4mLGte.mp4",
    "https://i.imgur.com/uthREbe.mp4", 
    "https://i.imgur.com/ee8fHna.mp4", 
    "https://i.imgur.com/VffzOwS.mp4",
    "https://i.imgur.com/ci5nztg.mp4", 
    "https://i.imgur.com/IGXINCB.mp4",
    "https://i.imgur.com/JnmXyO3.mp4",
    "https://i.imgur.com/Qudb0Vl.mp4",
    "https://i.imgur.com/N3wIadu.mp4",
    "https://i.imgur.com/X7lugs3.mp4",
    "https://i.imgur.com/6b61HGs.mp4",
    "https://i.imgur.com/EPzjIbt.mp4",
    "https://i.imgur.com/WWGiRvB.mp4",
    "https://i.imgur.com/20QmmsT.mp4",
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
    "https://i.imgur.com/rWRfAAZ.mp4"
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
    "https://i.imgur.com/e505Ko2.mp4",
    "https://i.imgur.com/3umJ6NL.mp4"
  ];

  // Pick a random video
  const randomLink = videoLinks[Math.floor(Math.random() * videoLinks.length)];

  // Create temp path to save video
  const tempPath = path.join(os.tmpdir(), `owner_video_${Date.now()}.mp4`);

  try {
    // Download video
    const response = await axios({
      url: randomLink,
      method: "GET",
      responseType: "stream"
    });

    const writer = fs.createWriteStream(tempPath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: message,
        attachment: fs.createReadStream(tempPath)
      }, event.threadID, () => {
        fs.unlinkSync(tempPath); // delete temp file
      }, event.messageID);
    });

    writer.on("error", (err) => {
      console.error("Error writing video:", err);
      api.sendMessage("⚠️ Error downloading video.", event.threadID, event.messageID);
    });

  } catch (err) {
    console.error("Download error:", err);
    api.sendMessage("⚠️ Failed to fetch the video.", event.threadID, event.messageID);
  }
};
