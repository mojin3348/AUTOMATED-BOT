const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "join",
  version: "1.0.0",
};

module.exports.handleEvent = async function ({ api, event }) {
  if (event.logMessageType !== "log:subscribe") return;

  const addedUsers = event.logMessageData.addedParticipants;
  const threadID = event.threadID;

  try {
    const threadInfo = await api.getThreadInfo(threadID);
    const groupName = threadInfo.threadName || "this group";
    const memberCount = threadInfo.participantIDs.length;

    for (const user of addedUsers) {
      const userID = user.userFbId;
      const firstName = user.fullName;

      // Background image – you can change this
      const background = "https://i.imgur.com/zv3FMpH.jpeg";

      // Generate welcome image URL
      const imageUrl = `https://join2apibyjonell-7b4fde8396f3.herokuapp.com/join2?name=${encodeURIComponent(firstName)}&id=${userID}&background=${encodeURIComponent(background)}&count=${memberCount}`;

      // Download welcome image
      const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const imagePath = path.join(__dirname, "cache", `welcome_${userID}.png`);
      fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));

      // Build welcome message
      const welcomeMessage = {
        body:
          `👋 Welcome, ${firstName}!\n` +
          `🏘️ Group: ${groupName}\n` +
          `🔢 You're member #${memberCount}\n\n` +
          `📌 Please read the group rules and enjoy your stay!`,
        attachment: fs.createReadStream(imagePath)
      };

      // Send message
      await api.sendMessage(welcomeMessage, threadID);
      fs.unlinkSync(imagePath); // Clean up
    }
  } catch (error) {
    console.error("❌ Error in welcome event:", error);
    api.sendMessage("❌ An error occurred while sending the welcome message.", threadID);
  }
};

module.exports.run = async () => {};
