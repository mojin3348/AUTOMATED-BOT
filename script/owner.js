const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
	name: 'owner',
	version: '1.0.0',
	hasPermision: 0,
	credits: 'Vern (Fixed by ChatGPT)',
	usePrefix: false,
	description: 'Display bot owner information with video',
	commandCategory: 'system',
	usages: '',
	cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
	try {
		const ownerInfo = {
			name: 'ARI',
			gender: 'MALE',
			age: 'HULAAN MO NALANG',
			height: '69',
			facebookLink: 'https://www.facebook.com/61577110900436',
			status: 'GUTOM'
		};

		const videoUrls = [
			"https://i.imgur.com/9LDVC57.mp4", "https://i.imgur.com/r7IxgiR.mp4", "https://i.imgur.com/J1jWubu.mp4",
			"https://i.imgur.com/DJylTiy.mp4", "https://i.imgur.com/v4mLGte.mp4", "https://i.imgur.com/uthREbe.mp4",
			"https://i.imgur.com/ee8fHna.mp4", "https://i.imgur.com/VffzOwS.mp4", "https://i.imgur.com/ci5nztg.mp4",
			"https://i.imgur.com/qHPeKDV.mp4", "https://i.imgur.com/Rkl5UmH.mp4", "https://i.imgur.com/IGXINCB.mp4",
			"https://i.imgur.com/JnmXyO3.mp4", "https://i.imgur.com/Qudb0Vl.mp4", "https://i.imgur.com/N3wIadu.mp4",
			"https://i.imgur.com/X7lugs3.mp4", "https://i.imgur.com/6b61HGs.mp4", "https://i.imgur.com/EPzjIbt.mp4",
			"https://i.imgur.com/WWGiRvB.mp4", "https://i.imgur.com/20QmmsT.mp4", "https://i.imgur.com/nN28Eea.mp4",
			"https://i.imgur.com/fknQ3Ut.mp4", "https://i.imgur.com/yXZJ4A9.mp4", "https://i.imgur.com/GnF9Fdw.mp4",
			"https://i.imgur.com/B86BX8T.mp4", "https://i.imgur.com/kZCBjkz.mp4", "https://i.imgur.com/id5Rv7O.mp4",
			"https://i.imgur.com/aWIyVpN.mp4", "https://i.imgur.com/aFIwl8X.mp4", "https://i.imgur.com/SJ60dUB.mp4",
			"https://i.imgur.com/ySu69zS.mp4", "https://i.imgur.com/mAmwCe6.mp4", "https://i.imgur.com/Sbztqx2.mp4",
			"https://i.imgur.com/s2d0BIK.mp4", "https://i.imgur.com/rWRfAAZ.mp4", "https://i.imgur.com/dYLBspd.mp4",
			"https://i.imgur.com/HCv8Pfs.mp4", "https://i.imgur.com/jdVLoxo.mp4", "https://i.imgur.com/hX3Znez.mp4",
			"https://i.imgur.com/cispiyh.mp4", "https://i.imgur.com/ApOSepp.mp4", "https://i.imgur.com/lFoNnZZ.mp4",
			"https://i.imgur.com/qDsEv1Q.mp4", "https://i.imgur.com/NjWUgW8.mp4", "https://i.imgur.com/ViP4uvu.mp4",
			"https://i.imgur.com/bim2U8C.mp4", "https://i.imgur.com/YzlGSlm.mp4", "https://i.imgur.com/HZpxU7h.mp4",
			"https://i.imgur.com/exTO3J4.mp4", "https://i.imgur.com/Xf6HVcA.mp4", "https://i.imgur.com/9iOci5S.mp4",
			"https://i.imgur.com/6w5tnvs.mp4", "https://i.imgur.com/1L0DMtl.mp4", "https://i.imgur.com/7wcQ8eW.mp4",
			"https://i.imgur.com/3MBTpM8.mp4", "https://i.imgur.com/8h1Vgum.mp4", "https://i.imgur.com/CTcsUZk.mp4",
			"https://i.imgur.com/e505Ko2.mp4", "https://i.imgur.com/3umJ6NL.mp4"
		];

		const chosenVideoUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
		const tmpDir = path.join(__dirname, 'tmp');

		if (!fs.existsSync(tmpDir)) {
			fs.mkdirSync(tmpDir);
		}

		const tempFileName = `owner_${Date.now()}.mp4`;
		const tempFilePath = path.join(tmpDir, tempFileName);

		const video = await axios.get(chosenVideoUrl, { responseType: 'arraybuffer' });
		fs.writeFileSync(tempFilePath, Buffer.from(video.data, 'binary'));

		const message = `
✧ 𝗢𝗪𝗡𝗘𝗥 𝗜𝗡𝗙𝗢 ✧

👤 Name: ${ownerInfo.name}
🚹 Gender: ${ownerInfo.gender}
🎂 Age: ${ownerInfo.age}
📏 Height: ${ownerInfo.height}
🔗 Facebook: ${ownerInfo.facebookLink}
📌 Status: ${ownerInfo.status}
		`.trim();

		await api.sendMessage({
			body: message,
			attachment: fs.createReadStream(tempFilePath)
		}, event.threadID, async () => {
			fs.unlinkSync(tempFilePath); // Delete file after sending
		}, event.messageID);

		// Optional: React if "owner" is typed
		if (event.body?.toLowerCase().includes("owner")) {
			api.setMessageReaction("😽", event.messageID, () => {}, true);
		}

	} catch (err) {
		console.error("❌ Error in owner command:", err);
		api.sendMessage("❌ Error occurred while sending owner info.", event.threadID, event.messageID);
	}
};
