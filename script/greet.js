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
  const greetings = ["hi", "hello", "hey", "hi po", "hola", "yo", "sup", "hiii", "hellow"];

  // Check if the message exactly matches any greeting
  if (greetings.includes(message)) {
    const reply = `hi, tapos ano? magiging friends tayo? lagi tayong mag uusap mula umaga hanggang madaling araw? tas magiging close tayo? sa sobrang close natin mahuhulog na tayo sa isa't isa, tapos ano? liligawan moko tapos sasagutin kita. tas paplanuhin natin yung pangarap natin sa isa't isa tapos ano? may makikita kang iba. magsasawa ka na, iiwan mo na ako. tapos magmamakaawa ako sayo kasi mahal kita pero ano? wala kang gagawin, hahayaan mo lang akong umiiyak while begging you to stay. kaya wag na lang. thanks na lang sa hi mo.`,
    `puro nalang ba tayo hi at hello?`,
    `hi, babe kain na?`,
    `hipo`,
    `hi, nakita mo ba owner kong si ari n aj?`,
    `hi bitch how's your day?`,
    `hello po, send boobies cravings lang 🥺🥺💔`;
    return api.sendMessage(reply, event.threadID, event.messageID);
  }
};

module.exports.run = async function () {
  // Leave empty unless using explicit commands
};
