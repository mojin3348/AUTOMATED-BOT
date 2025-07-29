module.exports.config = {
  name: "owner",
  version: "1.0.0",
  permission: 0, // 0 = anyone can use
  credits: "ARI",
  description: "Show bot owner's information",
  category: "info",
  usages: "/owner",
  cooldowns: 3
};

module.exports.run = async function({ api, event }) {
  const ownerInfo = {
    name: "ARI",                
    uid: "61577110900436",            
    facebook: "https://facebook.com/61577110900436", 
    note: "Feel free to reach out for bot concerns, and please don't spam the bot"  
  };

  const message = 
`👑 𝘽𝙤𝙩 𝙊𝙬𝙣𝙚𝙧 𝙄𝙣𝙛𝙤 👑

📛 Name: ${ownerInfo.name}
🆔 UID: ${ownerInfo.uid}
🌐 Facebook: ${ownerInfo.facebook}

📣 ${ownerInfo.note}`;

  return api.sendMessage(message, event.threadID, event.messageID);
};
