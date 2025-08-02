const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "welcome",
  version: "1.0.0",
};

module.exports.handleEvent = async function ({ api, event }) {
  if (event.logMessageType !== "log:subscribe") return;

  const threadID = event.threadID;
  const addedParticipants = event.logMessageData.addedParticipants;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const groupName = threadInfo.threadName || "this group";
    const memberCount = threadInfo.participantIDs.length;

    for (const user of addedParticipants) {
      const userID = user.userFbId;
      const userName = user.fullName;
      const firstName = userName.split(" ")[0];

      const background = "https://i.imgur.com/Ir3xU9A.jpg"; // You can customize this background

      // Build API link
      const imageURL = `https://hershey-api.onrender.com/api/welcome?username=${encodeURIComponent(name)}&avatarUrl=https://api-canvass.vercel.app/profile?uid=${senderID}&groupname=${encodeURIComponent(groupName)}&bg=${encodeURIComponent(background)}&memberCount=${memberCount}`;
      const filePath = path.join(__dirname, "cache", `welcome_${userID}.jpg`);

      try {
        // Fetch welcome image
        const response = await axios.get(imageURL, { responseType: "arraybuffer" });
        fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

        // Send welcome message with image
        await api.sendMessage({
          body: `👋 Welcome ${userName}!\nYou're now a member of "${groupName}".\n🎉 Member count: ${memberCount}`,
          attachment: fs.createReadStream(filePath)
        }, threadID);

        // Clean up temp file
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("⚠️ Error downloading/sending welcome image:", err.message);
        await api.sendMessage({
          body: `👋 Welcome ${userName}!\nYou're now a member of "${groupName}".\n🎉 Member count: ${memberCount}\n⚠️ (Image failed to load)`
        }, threadID);
      }
    }
  } catch (err) {
    console.error("❌ Error processing join event:", err.message);
    await api.sendMessage("❌ Error handling welcome event.", threadID);
  }
};

module.exports.run = () => {};
