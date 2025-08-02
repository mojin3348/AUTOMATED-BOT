const axios = require("axios");

let autoAccept = true;

module.exports.config = {
  name: "accept",
  version: "1.0.0",
  hasPermission: 2,
  credits: "ARI • Fixed by AJ Chicano",
  description: "Auto-accepts friend requests on your bot account",
  commandCategory: "admin",
  usages: "[on/off]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const userID = api.getCurrentUserID?.() || global.GoatBot?.config?.UID;
    if (!userID) return api.sendMessage("❌ Unable to get bot user ID.", event.threadID, event.messageID);

    if (args[0]?.toLowerCase() === "on") {
      autoAccept = true;
      return api.sendMessage("✅ Auto-accept is now turned **ON**.", event.threadID, event.messageID);
    } else if (args[0]?.toLowerCase() === "off") {
      autoAccept = false;
      return api.sendMessage("❌ Auto-accept is now turned **OFF**.", event.threadID, event.messageID);
    }

    if (!autoAccept) {
      return api.sendMessage("⚠️ Auto-accept is OFF. Use `accept on` to enable it.", event.threadID, event.messageID);
    }

    const formData = {
      av: userID,
      fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
      fb_api_caller_class: "RelayModern",
      doc_id: "4499164963466303",
      variables: JSON.stringify({ input: { scale: 3 } })
    };

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };

    const response = await axios.post("https://www.facebook.com/api/graphql/", new URLSearchParams(formData), { headers });
    const data = response.data;

    if (
      data &&
      data.data &&
      data.data.viewer &&
      data.data.viewer.friending_possibilities &&
      data.data.viewer.friending_possibilities.edges
    ) {
      const list = data.data.viewer.friending_possibilities.edges;
      const success = [], failed = [];

      for (const person of list) {
        const u = person.node;

        const confirmData = {
          av: userID,
          fb_api_req_friendly_name: "FriendingCometFriendRequestConfirmMutation",
          doc_id: "1472456629576662",
          variables: JSON.stringify({
            input: {
              friend_requester_id: u.id,
              action: "confirm"
            }
          })
        };

        try {
          const confirm = await axios.post("https://www.facebook.com/api/graphql/", new URLSearchParams(confirmData), { headers });
          const confirmRes = confirm.data;

          if (!confirmRes.errors) {
            success.push(u.name);
          } else {
            failed.push(u.name);
          }
        } catch (e) {
          failed.push(u.name);
        }
      }

      return api.sendMessage(
        `✅ Successfully accepted ${success.length} friend request(s):\n${success.join("\n")}` +
        (failed.length > 0 ? `\n❌ Failed to accept ${failed.length}:\n${failed.join("\n")}` : ""),
        event.threadID,
        event.messageID
      );
    } else {
      return api.sendMessage("⚠️ No friend requests found or data fetch failed.", event.threadID, event.messageID);
    }
  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ An error occurred while processing the request.", event.threadID, event.messageID);
  }
};
