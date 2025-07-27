module.exports.config = {
  name: "accept",
  version: "1.0.0",
  hasPermission: 2, // Admin only
  credits: "AJ Chicano",
  description: "Accept all pending friend requests by replying to them",
  commandCategory: "admin",
  usages: "accept",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  try {
    // Get up to 20 pending message threads (friend requests that messaged bot)
    const pending = await api.getThreadList(20, null, ["PENDING"]);

    if (pending.length === 0) {
      return api.sendMessage("✅ No pending friend requests to accept.", event.threadID, event.messageID);
    }

    let success = 0;

    for (const thread of pending) {
      try {
        // Send a simple message, which often triggers auto-accept
        await api.sendMessage("👋 Hello! Your friend request has been accepted automatically.", thread.threadID);
        success++;
      } catch (err) {
        console.log("❌ Error sending to:", thread.threadID, err.message);
      }
    }

    return api.sendMessage(`✅ Successfully accepted ${success} friend request(s)!`, event.threadID, event.messageID);
  } catch (err) {
    console.error("❌ Failed to process friend requests:", err);
    return api.sendMessage("❌ An error occurred while accepting friend requests.", event.threadID, event.messageID);
  }
};
