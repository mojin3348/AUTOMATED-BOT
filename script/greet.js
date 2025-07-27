module.exports.config = {
  name: "greet",
  version: "1.0.0",
  hasPermission: 0,
  credits: "AJ",
  description: "Respond to greetings",
  commandCategory: "autobot",
  usages: "[hi | hello | good morning]",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ event, api }) {
  const message = event.body.toLowerCase();

  // List of greetings to respond to
  const greetings = ["hi", "hello", "hey", "good morning", "good evening", "yo", "sup"];

  // Check if the message exactly matches any greeting
  if (greetings.includes(message)) {
    const reply = `👋 Hello ${event.senderID === event.threadID ? "there" : ""}! Hope you're doing well.`;
    return api.sendMessage(reply, event.threadID, event.messageID);
  }
};

module.exports.run = async function () {
  // Leave empty unless using explicit commands
};
