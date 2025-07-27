module.exports.config = {
  name: "tord",
  version: "1.0.0",
  hasPermission: 0,
  credits: "AJ Chicano",
  description: "Play Truth or Dare",
  commandCategory: "game",
  usages: "tord [truth/dare/random]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const truthList = [
    "What’s your biggest secret?",
    "Have you ever lied to your best friend?",
    "Who was your first crush?",
    "What's something you’re ashamed to admit?",
    "Have you ever broken someone’s heart?",
    "What’s your most embarrassing moment?",
    "What’s your worst habit?",
    "If you could be invisible for a day, what would you do?",
    "Who do you stalk the most on social media?",
    "What’s one thing you’ve never told your parents?"
  ];

  const dareList = [
    "Text your crush and say 'I like you 💖'",
    "Say something nice to the person you last argued with.",
    "Sing the chorus of your favorite song now!",
    "Change your profile pic to a funny one for 1 hour.",
    "Do 10 pushups and send proof!",
    "Talk like a baby for the next 2 minutes.",
    "Write 'I'm a potato' in the group chat.",
    "Pretend to be a cat for 1 minute.",
    "Tell the group your most recent Google search.",
    "Tag someone and say 'I secretly love you ❤️'"
  ];

  const choice = args[0] ? args[0].toLowerCase() : "";

  let result;
  if (choice === "truth") {
    result = `🟢 TRUTH:\n${truthList[Math.floor(Math.random() * truthList.length)]}`;
  } else if (choice === "dare") {
    result = `🔴 DARE:\n${dareList[Math.floor(Math.random() * dareList.length)]}`;
  } else {
    const isTruth = Math.random() < 0.5;
    result = isTruth
      ? `🟢 TRUTH:\n${truthList[Math.floor(Math.random() * truthList.length)]}`
      : `🔴 DARE:\n${dareList[Math.floor(Math.random() * dareList.length)]}`;
  }

  return api.sendMessage(result, event.threadID, event.messageID);
};
