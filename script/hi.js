const moment = require("moment-timezone");

module.exports.config = {
  name: "hi",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Sam (fixed by AJ)",
  hasPrefix: false,
  description: "Auto-reply to hi/hello with sweet message & sticker",
  commandCategory: "QTV BOX",
  usages: "[toggle hi auto-response]",
  cooldowns: 5
};

module.exports.handleEvent = async ({ event, api, Users }) => {
  const greetings = [
    "hello", "hi", "hello po", "hi po", "hiii", "helloo", "loe", "low", "lo",
    "hey", "heyy", "loe po", "low po", "hai", "chào", "chao", "hí", "híí",
    "hì", "hìì", "lô", "helo", "hê nhô", "goodevening", "good evening",
    "goodeve", "gn", "eve", "evening", "good afternoon", "good aftie",
    "aftie", "afternoon"
  ];

  const thread = global.data.threadData.get(event.threadID) || {};
  if (thread["hi"] === false) return;

  const message = event.body?.toLowerCase()?.trim();
  if (!message || !greetings.includes(message)) return;

  const stickerList = [
    "422812141688367", "1775288509378520", "476426593020937", "476420733021523",
    "147663618749235", "466041158097347", "1528732074026137", "476426753020921",
    "529233794205649", "1330360453820546"
  ];

  const replies = [
    "have you eaten?", "what are you doing?", "how are you baby?",
    "I'm a chat bot, nice to meet you!", "I'm updating my commands, what are you doing?",
    "Can you interact with me using sim command?", "You're so beautiful/handsome, binibini/ginoo.",
    "I love you mwa~ *kisses forehead*", "Are you bored? Talk to my admin.",
    "How are you, my dear?", "Eat some sweets!", "Are you ok?", "Be safe!"
  ];

  const sticker = stickerList[Math.floor(Math.random() * stickerList.length)];
  const reply = replies[Math.floor(Math.random() * replies.length)];
  const name = await Users.getNameUser(event.senderID);

  const hour = moment.tz("Asia/Manila").hour();
  const day = moment.tz("Asia/Manila").format("dddd").toLowerCase();
  const session =
    hour < 4 ? "late night" :
    hour < 11 ? "morning" :
    hour < 15 ? "afternoon" :
    hour < 21 ? "evening" :
    "late night and advance sleepwell";

  const msg = {
    body: `Hi ${name}, have a good ${day}, ${session} baby, ${reply}`,
    mentions: [{ tag: name, id: event.senderID }]
  };

  api.sendMessage(msg, event.threadID, () => {
    setTimeout(() => {
      api.sendMessage({ sticker }, event.threadID);
    }, 100);
  }, event.messageID);
};

module.exports.languages = {
  vi: {
    on: "Bật",
    off: "Tắt",
    successText: "thành công"
  },
  en: {
    on: "on",
    off: "off",
    successText: "success!"
  }
};

module.exports.run = async ({ event, api, Threads, getText }) => {
  const { threadID, messageID } = event;
  const data = (await Threads.getData(threadID)).data;

  data["hi"] = !data["hi"];
  await Threads.setData(threadID, { data });
  global.data.threadData.set(threadID, data);

  return api.sendMessage(
    `${data["hi"] ? getText("on") : getText("off")} ${getText("successText")}`,
    threadID,
    messageID
  );
};
