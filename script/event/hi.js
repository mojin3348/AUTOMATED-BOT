const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "hiEvent",
    version: "1.0.0",
    credits: "Converted by ChatGPT | Original: Sam",
    description: "Replies when someone says hi with a message and sticker",
    dependencies: {},
    eventType: ["message"],
    type: "event"
  },

  async run({ event, api, Users }) {
    const { threadID, senderID, body } = event;
    const hiToggle = global.data.threadData.get(threadID)?.hi;

    // Check if toggle is enabled
    if (typeof hiToggle === "undefined" || hiToggle === false) return;

    const KEYWORDS = [
      "hello", "hi", "hello po", "hi po", "hiii", "helloo", "loe", "low", "lo",
      "hey", "heyy", "loe po", "low po", "hai", "chào", "chao", "hí", "híí",
      "hì", "hìì", "lô", "helo", "hê nhô", "goodevening", "good evening",
      "goodeve", "gn", "eve", "evening", "good afternoon", "good aftie",
      "aftie", "afternoon"
    ];

    if (!KEYWORDS.includes(body?.toLowerCase())) return;

    const stickers = [
      "422812141688367", "1775288509378520", "476426593020937",
      "476420733021523", "147663618749235", "466041158097347",
      "1528732074026137", "476426753020921", "529233794205649",
      "1330360453820546"
    ];

    const responses = [
      "have you eaten?", "what are you doing?", "how are you baby?",
      "I'm a chat bot nice to meet you",
      "I'm updating my commands, what are you doing?",
      "Can you interact with me using sim command?",
      "You're so beautiful/handsome binibini/ginoo",
      "I love you mwa */kiss your forehead.",
      "are you bored? talk to my admin", "how are you my dear",
      "eat some sweets", "are you ok?", "be safe"
    ];

    const name = await Users.getNameUser(senderID);
    const sticker = stickers[Math.floor(Math.random() * stickers.length)];
    const juswa1 = responses[Math.floor(Math.random() * responses.length)];

    const day = moment.tz('Asia/Manila').format('dddd').toLowerCase();
    const hour = parseInt(moment.tz('Asia/Dhaka').format('HHmm'));
    let session = "";

    if (hour > 0 && hour <= 400) session = "bright morning";
    else if (hour <= 700) session = "morning";
    else if (hour <= 1100) session = "morning";
    else if (hour <= 1500) session = "afternoon";
    else if (hour <= 2100) session = "evening";
    else session = "late night and advance sleepwell";

    const msg = {
      body: `Hi ${name}, have a good ${day} baby, ${juswa1}`,
      mentions: [{ tag: name, id: senderID }]
    };

    api.sendMessage(msg, threadID, () => {
      setTimeout(() => {
        api.sendMessage({ sticker }, threadID);
      }, 100);
    });
  }
};
