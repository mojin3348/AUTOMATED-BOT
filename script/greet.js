module.exports.config = {
  name: "greet",
  version: "1.0.0",
  hasPermission: 0,
  credits: "AJ",
  description: "Responds to hi or hello with a friendly message",
  commandCategory: "AutoBot",
  usages: "[hi | hello]",
  cooldowns: 3
};

module.exports.run = async function({ api, event, args, Users }) {
  const { threadID, senderID } = event;
  const userName = (await Users.getName(senderID)) || "there";
  const input = args.join(" ").toLowerCase();

  const hiHello = ["hi", "hello", "hey", "yo", "sup", "hi po", "hello po", "hai", "hola"];

  if (!hiHello.includes(input)) {
    return api.sendMessage(`Just type "hi" or "hello" to get greeted!`, threadID);
  }

  const replies = [
    `hi, tapos ano? magiging friends tayo? lagi tayong mag uusap mula umaga hanggang madaling araw? tas magiging close tayo? sa sobrang close natin mahuhulog na tayo sa isa't isa, tapos ano? liligawan moko tapos sasagutin kita. tas paplanuhin natin yung pangarap natin sa isa't isa tapos ano? may makikita kang iba. magsasawa ka na, iiwan mo na ako. tapos magmamakaawa ako sayo kasi mahal kita pero ano? wala kang gagawin, hahayaan mo lang akong umiiyak while begging you to stay. kaya wag na lang. thanks na lang sa hi mo.`,
    `puro nalang ba tayo hi at hello?`,
    `hi, babe kain na?`,
    `hipo`,
    `hi, nakita mo ba owner kong si ari n aj?`,
    `hi bitch how's your day?`,
    `hello po, send boobies cravings lang 🥺🥺💔`
  ];

  const randomReply = replies[Math.floor(Math.random() * replies.length)];
  return api.sendMessage(randomReply, threadID);
};
