module.exports.config = {
  name: "pendinggc",
  version: "1.0.0",
  hasPermission: 2, // Admins only
  credits: "AJ/ARI",
  description: "List and accept pending group chats",
  commandCategory: "admin",
  usages: "pendinggc\naccept [threadID]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const action = args[0];
  const threadID = args[1];

  // If user types: accept [threadID]
  if (action === "accept" && threadID) {
    try {
      await api.approveJoinRequest(threadID);
      await api.sendMessage("✅ Bot has joined this group chat!", threadID);
      return api.sendMessage(`✅ Successfully accepted thread ID: ${threadID}`, event.threadID, event.messageID);
    } catch (err) {
      console.error("❌ Failed to approve thread:", err);
      return api.sendMessage("⚠️ Could not approve this thread. It may not be pending or permission is missing.", event.threadID, event.messageID);
    }
  }

  // If user types: pendinggc
  try {
    const threads = await api.getThreadList(50, null, ["PENDING"]);
    if (threads.length === 0) {
      return api.sendMessage("✅ No pending group chat requests found.", event.threadID, event.messageID);
    }

    let msg = `📥 Pending Group Chats:\n\n`;
    for (const thread of threads) {
      msg += `• ${thread.name || "No Name"}\n🆔 TID: ${thread.threadID}\n────────────\n`;
    }
    msg += `\nTo accept, type:\naccept [threadID]`;

    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (err) {
    console.error("❌ Error listing pending GCs:", err);
    return api.sendMessage("⚠️ Could not fetch pending threads. Please try again.", event.threadID, event.messageID);
  }
};
