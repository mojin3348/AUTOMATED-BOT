const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "welcome",
    version: "1.0.0",
    };

module.exports.handleEvent = async function ({ api, event }) {
    if (event.logMessageType !== "log:subscribe") return;

    const botID = api.getCurrentUserID();
    const threadID = event.threadID;
    const addedParticipants = event.logMessageData.addedParticipants;

    const threadInfo = await api.getThreadInfo(threadID);
    const groupName = threadInfo.threadName || "Unnamed Group";
    const memberCount = threadInfo.participantIDs.length;

    for (const participant of addedParticipants) {
        const userID = participant.userFbId;

        // If bot is added to the group
        if (userID === botID) {
            const botName = global.config.BOTNAME || "Botibot";
            const prefix = global.config.PREFIX || "";
            return api.sendMessage(
                `✅ | ${botName} connected successfully!\nType "${prefix}help" to view all commands.\n\nContact the admin if you encounter an error.\n\n👷Developer: [ARI]`,
                threadID
            );
        }

        try {
            const userInfo = await api.getUserInfo(userID);
            const userName = userInfo[userID].name || "New User";
            const firstName = userName.split(" ")[0];

            const avatarOptions = [
                "https://i.postimg.cc/pTGHDKnY/images-2023-08-19-T230758-444.jpg",
                "https://i.postimg.cc/pd0WBwwF/images-2023-08-19-T230807-555.jpg",
                "https://i.postimg.cc/gkvG7L9d/images-2023-08-19-T230828-578.jpg",
                "https://i.postimg.cc/XNfXtYyf/images-2023-08-19-T230845-301.jpg"
            ];
            const background = avatarOptions[Math.floor(Math.random() * avatarOptions.length)];

            const welcomeUrl = `https://join2apibyjonell-7b4fde8396f3.herokuapp.com/join2?name=${encodeURIComponent(firstName)}&id=${userID}&background=${encodeURIComponent(background)}&count=${memberCount}`;

            const response = await axios.get(welcomeUrl, { responseType: "arraybuffer" });
            const cacheDir = path.join(__dirname, "cache");
            const filePath = path.join(cacheDir, `welcome_${userID}.jpg`);

            // Ensure cache directory exists
            if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });
            fs.writeFileSync(filePath, Buffer.from(response.data));

            const body = `👋 Welcome ${userName}!\n🎉 You are the ${memberCount}th member of ${groupName}.\nEnjoy your stay!`;

            await api.sendMessage({
                body,
                attachment: fs.createReadStream(filePath),
                mentions: [{ tag: userName, id: userID }]
            }, threadID);

            fs.unlinkSync(filePath);
        } catch (error) {
            console.error("❌ Error in welcome command:", error.message);
            api.sendMessage(`👋 Welcome a new member to the group!`, threadID);
        }
    }
};
