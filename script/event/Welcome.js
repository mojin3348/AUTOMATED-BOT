const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "welcome",
    version: "1.0.0",
};

module.exports.handleEvent = async function ({ api, event }) {
    if (event.logMessageType !== "log:subscribe") return;

    const addedParticipants = event.logMessageData.addedParticipants;

    for (const participant of addedParticipants) {
        const senderID = participant.userFbId;

        try {
            // Get user info
            const userInfo = await api.getUserInfo(senderID);
            let name = userInfo[senderID].name || "New Member";

            // Truncate name
            const maxLength = 15;
            if (name.length > maxLength) {
                name = name.substring(0, maxLength - 3) + '...';
            }

            // Get group info
            const groupInfo = await api.getThreadInfo(event.threadID);
            const groupName = groupInfo.threadName || "this group";
            const memberCount = groupInfo.participantIDs.length;
            const background = groupInfo.imageSrc || "https://i.ibb.co/4YBNyvP/images-76.jpg";

            // API for welcome image
            const url = `https://betadash-api-swordslush-production.up.railway.app/night-street?userid=${senderID}&text=${encodeURIComponent(name)}&avatarUrl=https://api-canvass.vercel.app/profile?uid=${senderID}&groupname=${encodeURIComponent(groupName)}&bg=${encodeURIComponent(background)}&memberCount=${memberCount}`;

            const { data } = await axios.get(url, { responseType: 'arraybuffer' });

            const dir = './script/cache/';
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

            const filePath = path.join(dir, `welcome_${senderID}.jpg`);
            fs.writeFileSync(filePath, Buffer.from(data));

            // Send message with image
            api.sendMessage({
                body: `🎉 Everyone welcome ${name} to ${groupName}!\nYou're member #${memberCount}!`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => fs.unlinkSync(filePath));

        } catch (error) {
            console.error("❌ Error generating welcome image:", error.message);

            api.sendMessage({
                body: `🎉 Everyone welcome a new member to the group!`,
            }, event.threadID);
        }
    }
};
