const axios = require("axios");

let autoAccept = true;

module.exports.config = {
  name: "accept",
  version: "1.0.0",
  hasPermission: 2,
  credits: "ChatGPT • Modified by AJ Chicano",
  description: "Auto accept pending friend requests",
  commandCategory: "admin",
  usages: "[on/off]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const input = args[0];

  if (input === "on") {
    autoAccept = true;
    return api.sendMessage("✅ Auto accept is now ON. The bot will accept friend requests automatically.", event.threadID);
  } else if (input === "off") {
    autoAccept = false;
    return api.sendMessage("❌ Auto accept is now OFF.", event.threadID);
  } else {
    return api.sendMessage("❓ Usage: accept [on/off]", event.threadID);
  }
};

module.exports.handleEvent = async function ({ api }) {
  if (!autoAccept) return;

  try {
    const friends = await api.getFriendsList();
    const pending = friends.filter(f => f.isFriend === false);

    for (const user of pending) {
      await api.acceptFriendRequest(user.userID);
      console.log(`🤝 Accepted: ${user.fullName}`);
    }
  } catch (error) {
    console.error("❌ Error while accepting friend requests:", error);
  }
};
