const moment = require("moment-timezone");

module.exports.config = {
  name: "hi",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "sam (converted by AJ)",
  hasPrefix: false,
  description: "Replies with hi + sweet message",
  commandCategory: "QTV BOX",
  usages: "[hi]",
  cooldowns: 5
};

module.exports.run = async ({ event, api, args, Users }) => {
  const { threadID, messageID, senderID } = event;

  const greetings = [
    "hello", "hi", "hello po", "hi po", "hiii", "helloo", "loe", "low", "lo",
    "hey", "heyy", "loe po", "low po", "hai", "chào", "chao", "hí", "híí",
    "hì", "hìì", "lô", "helo", "hê nhô", "goodevening", "good evening",
    "goodeve", "gn", "eve", "evening", "good afternoon", "good aftie",
    "aftie", "afternoon"
  ];

  const input = args.join(" ").toLowerCase();
  if (!greetings.includes(input)) return api.sendMessage("Say a greeting like 'hi' or 'hello'.", threadID, messageID);

  const stickerList = [
    "422812141688367", "1775288509378520", "476426593020937",
    "476420733021523", "147663618749235", "466041158097347",
    "1528732074026137", "476426753020921", "529233794205649",
    "1330360453820546"
  ];

  const replies = [
    "have you eaten?", "what are you doing?", "how are you baby?",
    "I'm a chat bot nice to meet you", "I'm updating my commands, what are you doing?",
    "Can you interact with me using sim command?",
    "You're so beautiful/handsome binibini/ginoo", "I love you mwa */kiss your forehead.",
    "are you bored? talk to my admin", "how are you my dear",
    "eat some sweets", "are you ok?", "be safe"
  ];

  const name = await Users.getNameUser(senderID);
  const sticker = stickerList[Math.floor(Math.random() * stickerList.length)];
  const reply = replies[Math.floor(Math.random() * replies.length)];

  const hour = parseInt(moment.tz('Asia/Dhaka').format('HHmm'));
  const day = moment.tz('Asia/Manila').format('dddd').toLowerCase();

  const session = (
    hour > 0 && hour <= 400 ? "bright morning" :
    hour <= 700 ? "morning" :
    hour <= 1100 ? "morning" :
    hour <= 1500 ? "afternoon" :
    hour <= 2100 ? "evening" :
    "late night and advance sleepwell"
  );

  const message = `Hi ${name}, have a good ${day} baby, ${reply}`;
  const mentions = [{ tag: name, id: senderID }];

  api.sendMessage({ body: message, mentions }, threadID, () => {
    setTimeout(() => {
      api.sendMessage({ sticker }, threadID);
    }, 100);
  }, messageID);
};
