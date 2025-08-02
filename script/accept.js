const moment = require("moment-timezone");

let autoAccept = true;

module.exports.config = {
  name: "accept",
  version: "1.0.0",
  hasPermission: 0,
  credits: "ARI • Converted by AJ Chicano",
  description: "Auto accept friend requests via bot account",
  commandCategory: "admin",
  usages: "[on/off]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (args.length >= 1) {
      if (args[0].toLowerCase() === "on") {
        autoAccept = true;
        return api.sendMessage("✅ Auto-accept is now turned **ON**.", event.threadID, event.messageID);
      } else if (args[0].toLowerCase() === "off") {
        autoAccept = false;
        return api.sendMessage("❌ Auto-accept is now turned **OFF**.", event.threadID, event.messageID);
      }
    }

    if (!autoAccept) {
      return api.sendMessage("⚠️ Auto-accept is currently turned **OFF**. Use `accept on` to enable it.", event.threadID, event.messageID);
    }

    const form = {
      av: api.getCurrentUserID(),
      fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
      fb_api_caller_class: "RelayModern",
      doc_id: "4499164963466303",
      variables: JSON.stringify({ input: { scale: 3 } })
    };

    const response = await api.httpPost("https://www.facebook.com/api/graphql/", form);
    const responseData = JSON.parse(response);

    if (responseData.data?.viewer?.friending_possibilities) {
      const listRequest = responseData.data.viewer.friending_possibilities.edges;
      const success = [];
      const failed = [];

      for (const user of listRequest) {
        const u = user.node;
        const friendRequestForm = {
          av: api.getCurrentUserID(),
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
          const friendRequest = await api.httpPost("https://www.facebook.com/api/graphql/", friendRequestForm);
          const friendRequestData = JSON.parse(friendRequest);

          if (!friendRequestData.errors) {
            success.push(u.name);
          } else {
            failed.push(u.name);
          }
        } catch (e) {
          failed.push(u.name);
        }
      }

      return api.sendMessage(
        `✅ Auto-accepted ${success.length} friend request(s):\n${success.join("\n")}` +
        (failed.length > 0 ? `\n❌ Failed to accept ${failed.length} request(s):\n${failed.join("\n")}` : ""),
        event.threadID,
        event.messageID
      );
    } else {
      return api.sendMessage("⚠️ Unable to fetch friend requests data.", event.threadID, event.messageID);
    }
  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ An error occurred while processing the request.", event.threadID, event.messageID);
  }
};
