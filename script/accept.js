let autoAccept = true;

module.exports.config = {
  name: "accept",
  version: "1.0.0",
  hasPermission: 2,
  credits: "ARI • Fixed by AJ Chicano",
  description: "Auto-accept friend requests on message receive",
  commandCategory: "admin",
  usages: "[on/off]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const input = args[0];

  if (input === "on") {
    autoAccept = true;
    return api.sendMessage("✅ Auto accept is now ON. The bot will accept friend requests when someone messages.", event.threadID);
  } else if (input === "off") {
    autoAccept = false;
    return api.sendMessage("❌ Auto accept is now OFF.", event.threadID);
  } else {
    return api.sendMessage("❓ Usage: accept [on/off]", event.threadID);
  }
};

// Trigger on any message sent to bot (PM or GC)
module.exports.handleEvent = async function ({ api, event }) {
  if (!autoAccept) return;
  if (event.isGroup) return; 

  try {
    const userInfo = await api.getUserInfo(event.senderID);
    const user = userInfo[event.senderID];

    if (!user.isFriend) {
      await api.acceptFriendRequest(event.senderID);
      console.log(`🤝 Accepted friend request from ${user.name}`);
    }
  } catch (err) {
    console.error("❌ Failed to accept friend request:", err);
  }
};
