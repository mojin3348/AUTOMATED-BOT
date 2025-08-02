const axios = require("axios");
const moment = require("moment-timezone");
const fs = require("fs");

// Load Facebook session cookie from config file
const fbConfig = JSON.parse(fs.readFileSync(__dirname + "/../config/fb.config.json", "utf8")); // adjust path if needed

let autoAccept = true;

module.exports.config = {
  name: "accept",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "ARI • Converted & Cookie-secured by AJ Chicano",
  description: "Auto-accepts pending friend requests on the bot account",
  commandCategory: "admin",
  usages: "[on/off]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const userID = api.getCurrentUserID?.() || global.GoatBot?.config?.UID;

  if (!userID)
    return api.sendMessage("❌ Unable to fetch bot user ID.", event.threadID, event.messageID);

  if (args[0]?.toLowerCase() === "on") {
    autoAccept = true;
    return api.sendMessage("✅ Auto-accept has been turned ON.", event.threadID, event.messageID);
  } else if (args[0]?.toLowerCase() === "off") {
    autoAccept = false;
    return api.sendMessage("❌ Auto-accept has been turned OFF.", event.threadID, event.messageID);
  }

  if (!autoAccept) {
    return api.sendMessage("⚠️ Auto-accept is OFF. Use `accept on` to enable it.", event.threadID, event.messageID);
  }

  try {
    const formData = {
      av: userID,
      fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
      fb_api_caller_class: "RelayModern",
      doc_id: "4499164963466303",
      variables: JSON.stringify({ input: { scale: 3 } }),
    };

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Cookie": fbConfig.cookie
    };

    const response = await axios.post(
      "https://www.facebook.com/api/graphql/",
      new URLSearchParams(formData),
      { headers }
    );

    const edges = response.data?.data?.viewer?.friending_possibilities?.edges || [];

    if (!edges.length)
      return api.sendMessage("⚠️ No pending friend requests found.", event.threadID, event.messageID);

    const success = [], failed = [];

    for (const { node } of edges) {
      const confirmData = {
        av: userID,
        fb_api_req_friendly_name: "FriendingCometFriendRequestConfirmMutation",
        doc_id: "1472456629576662",
        variables: JSON.stringify({
          input: {
            friend_requester_id: node.id,
            action: "confirm"
          }
        }),
      };

      try {
        const confirm = await axios.post(
          "https://www.facebook.com/api/graphql/",
          new URLSearchParams(confirmData),
          { headers }
        );

        if (!confirm.data?.errors) {
          success.push(node.name);
        } else {
          failed.push(node.name);
        }
      } catch (e) {
        failed.push(node.name);
      }
    }

    return api.sendMessage(
      `✅ Accepted ${success.length} request(s):\n${success.join("\n")}` +
      (failed.length ? `\n❌ Failed ${failed.length}:\n${failed.join("\n")}` : ""),
      event.threadID,
      event.messageID
    );
  } catch (err) {
    console.error("AutoAccept Error:", err.message);
    return api.sendMessage("❌ Something went wrong while processing friend requests.", event.threadID, event.messageID);
  }
};
