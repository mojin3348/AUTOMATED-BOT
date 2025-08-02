const axios = require("axios");

let autoAccept = false;

module.exports.config = {
  name: "accept",
  version: "1.0.0",
  hasPermission: 2, 
  credits: "AJ Chicano",
  description: "Toggle auto-accept friend requests",
  commandCategory: "admin",
  usages: "[on/off]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const input = args[0]?.toLowerCase();

  if (!["on", "off"].includes(input)) {
    return api.sendMessage(
      `⚙️ Usage: ${global.config.PREFIX}accept [on/off]`,
      threadID,
      messageID
    );
  }

  autoAccept = input === "on";
  return api.sendMessage(
    `✅ Auto-accept friend requests is now ${autoAccept ? "enabled" : "disabled"}.`,
    threadID,
    messageID
  );
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!autoAccept) return;

  try {
    const list = await api.getFriendsList();
    const pendingRequests = list.filter(user => user.isFriend === false);

    for (const user of pendingRequests) {
      await api.acceptFriendRequest(user.userID);
      console.log(`✅ Accepted request from ${user.fullName} (${user.userID})`);
    }
  } catch (err) {
    console.error("❌ Error accepting friend requests:", err);
  }
};
