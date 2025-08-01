const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "join",
  version: "1.0.0",
};

module.exports.handleEvent = async function ({ api, event }) {
  if (event.logMessageType !== "log:subscribe") return;

  const addedParticipants = event.logMessageData.addedParticipants;
  const threadID = event.threadID;
  const threadInfo = await api.getThreadInfo(threadID);
  const groupName = threadInfo.threadName || "this group";
  const memberCount = threadInfo.participantIDs.length;

  for (let user of addedParticipants) {
    const userID = user.userFbId;
    const userName = user.fullName;

    const firstName = userName.split(" ")[0];
    const background = "https://i.imgur.com/Ir3xU9A.jpg"; // Change to your desired background

    try {
      const imageURL = `https://join2apibyjonell-7b4fde8396f3.herokuapp.com/join2?name=${encodeURIComponent(firstName)}&id=${userID}&background=${encodeURIComponent(background)}&count=${memberCount}`;
      const response = await axios.get(imageURL, { responseType: "arraybuffer" });

      const imagePath = path.join(__dirname, "cache", `welcome_${userID}.jpg`);
      fs.writeFileSync(imagePath, Buffer.from(response.data, "binary"));

      const message = {
        body: `👋 Welcome ${userName}!\n\nYou are now a member of "${groupName}" 🎉\nYou're member #${memberCount}!`,
        attachment: fs.createReadStream(imagePath),
      };

      await api.sendMessage(message, threadID);
      fs.unlinkSync(imagePath); // Clean up after sending
    } catch (error) {
      console.error("Error sending welcome message:", error);
      api.sendMessage(`❌ Failed to send welcome image for ${userName}.`, threadID);
    }
  }
};

module.exports.run = () => {};
