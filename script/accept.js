let autoAccept = true;

module.exports.config = {
  name: "accept",
  version: "1.0.0",
  hasPermission: 2,
  credits: "Fixed by ARI • AJ",
  description: "Toggle auto-accept of friend requests",
  commandCategory: "admin",
  usages: "[on/off]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const input = args[0]?.toLowerCase();

  if (input === "on") {
    autoAccept = true;
    return api.sendMessage("✅ Auto-accept friend request is now ON.", event.threadID);
  } else if (input === "off") {
    autoAccept = false;
    return api.sendMessage("❌ Auto-accept is now OFF.", event.threadID);
  } else {
    return api.sendMessage("❓ Usage: accept [on/off]", event.threadID);
  }
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!autoAccept) return;
  if (!event.logMessageType || event.logMessageType !== "log:subscribe") return;

  try {
    const addedParticipants = event.logMessageData.addedParticipants;
    for (const participant of addedParticipants) {
      const userID = participant.userFbId;

      // Check if the user is the bot itself
      if (userID === api.getCurrentUserID()) continue;

      // Accept friend request (if user recently sent one)
      await api.changeFriendStatus(userID, true);
      console.log(`🤝 Friend request accepted: ${userID}`);
    }
  } catch (err) {
    console.error("❌ Error while auto-accepting friend request:", err);
  }
};
