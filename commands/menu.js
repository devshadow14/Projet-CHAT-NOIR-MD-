const settings = require('../settings');
const fs = require('fs');
const path = require('path');

async function menuCommand(sock, chatId, message, args) {
    const userName = message.pushName || "Utilisateur";

    // ── MODE ──
    const botMode = settings.self === true ? 'PRIVATE 🔒' : 'PUBLIC 🌍';

    // ===== MENU STYLE =====
    const menuMessage = `
╔━━━⊷≫ 𝙸𝙽𝙵𝙾 𝙱𝙾𝚃 ≪⊷━━━╗
║╭────────────
║│ 𝚄𝚂𝙴𝚁  : ${userName}
║│ 𝙱𝙾𝚃 𝙽𝙰𝙼𝙴 : 𝙲𝙷𝙰𝚃 𝙽𝙾𝙸𝚁-𝙼𝙳
║│ 𝚂𝚃𝙰𝚃𝚄𝚂 : Online 🟢
║│ 𝙿𝚁𝙴𝙵𝙸𝚇 : "."
║│ 𝙼𝙾𝙳𝙴 : ${botMode}
║│ 𝙾𝚆𝙽𝙴𝚁 : DEV MICHAEL SCOFIELD
║╰────────────
╚━━━━━━━━━━━━━━━━━━╝

║➠ 𝚄𝚂𝙴𝚁
╔━━━━━━━━━━━━━━━━━━╗
║╭───────────────
║┃• 𝙿𝙸𝙽𝙶
║┃• 𝙰𝙻𝙸𝚅𝙴
║┃• 𝙾𝚆𝙽𝙴𝚁
║┃• 𝙰𝙳𝙼𝙸𝙽𝚂
║┃• 𝙶𝚁𝙾𝚄𝙿𝙸𝙽𝙵𝙾
║┃• 𝙹𝙸𝙳
║┃• 𝚄𝚁𝙻
║╰───────────────
╚━━━━━━━━━━━━━━━━━━╝

║➠ 𝙼𝙴𝙳𝙸𝙰 / 𝚃𝙾𝙾𝙻𝚂
╔━━━━━━━━━━━━━━━━━━╗
║╭───────────────
║┃• 𝚂𝚃𝙸𝙲𝙺𝙴𝚁
║┃• 𝚃𝙰𝙺𝙴
║┃• 𝚅𝚅
║┃• 𝙱𝙻𝚄𝚁
║┃• 𝚁𝙴𝙼𝙸𝙽𝙸
║┃• 𝙲𝚁𝙾𝙿
║┃• 𝙴𝙼𝙾𝙹𝙸𝙼𝙸𝚇
║╰───────────────
╚━━━━━━━━━━━━━━━━━━╝

║➠ 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁𝚂
╔━━━━━━━━━━━━━━━━━━╗
║╭───────────────
║┃• 𝙵𝙰𝙲𝙴𝙱𝙾𝙾𝙺 <𝚄𝚁𝙻>
║┃• 𝙸𝙽𝚂𝚃𝙰 <𝚄𝚁𝙻>
║┃• 𝚃𝙸𝙺𝚃𝙾𝙺 <𝚄𝚁𝙻>
║┃• 𝚂𝙾𝙽𝙶 <𝙽𝙰𝙼𝙴>
║┃• 𝙿𝙻𝙰𝚈 <𝙽𝙰𝙼𝙴>
║╰───────────────
╚━━━━━━━━━━━━━━━━━━╝

║➠ 𝙶𝚁𝙾𝚄𝙿
╔━━━━━━━━━━━━━━━━━━╗
║╭───────────────
║┃• 𝚆𝙴𝙻𝙲𝙾𝙼𝙴 𝙾𝙽/𝙾𝙵𝙵
║┃• 𝙶𝙾𝙾𝙳𝙱𝚈𝙴 𝙾𝙽/𝙾𝙵𝙵
║┃• 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 𝙾𝙽/𝙾𝙵𝙵
║┃• 𝙰𝙽𝚃𝙸-𝙵𝙾𝚁𝚆𝙰𝚁𝙳 𝙾𝙽/𝙾𝙵𝙵
║┃• 𝙼𝚄𝚃𝙴 @𝚄𝚂𝙴𝚁
║┃• 𝚄𝙽𝙼𝚄𝚃𝙴 @𝚄𝚂𝙴𝚁
║┃• 𝚃𝙰𝙶𝙰𝙻𝙻
║┃• 𝙷𝙸𝙳𝙴𝚃𝙰𝙶
║┃• 𝙺𝙸𝙲𝙺
║┃• 𝙿𝚁𝙾𝙼𝙾𝚃𝙴
║┃• 𝙳𝙴𝙼𝙾𝚃𝙴
║┃• 𝙻𝙸𝙽𝙺
║┃• 𝚁𝙴𝚅𝙾𝙺𝙴
║┃• 𝙲𝙻𝙴𝙰𝚁
║┃• 𝙲𝙷𝙰𝚃𝙱𝙾𝚃
║╰───────────────
╚━━━━━━━━━━━━━━━━━━╝

║➠ 𝙰𝙳𝚅𝙰𝙽𝙲𝙴𝙳
╔━━━━━━━━━━━━━━━━━━╗
║╭───────────────
║┃• 𝙰𝚄𝚃𝙾𝚁𝙴𝙰𝙳 𝙾𝙽/𝙾𝙵𝙵
║┃• 𝙰𝚄𝚃𝙾𝚁𝙴𝙰𝙲𝚃 𝙾𝙽/𝙾𝙵𝙵
║┃• 𝙰𝚄𝚃𝙾𝚂𝚃𝙰𝚃𝚄𝚂 𝙾𝙽/𝙾𝙵𝙵
║┃• 𝙰𝚄𝚃𝙾𝚃𝚈𝙿𝙸𝙽𝙶 𝙾𝙽/𝙾𝙵𝙵
║┃• 𝙼𝙾𝙳𝙴
║┃• 𝚂𝚄𝙳𝙾 𝙰𝙳𝙳
║┃• 𝙿𝙼𝙱𝙻𝙾𝙲𝙺𝙴𝚁
║┃• 𝚄𝙿𝙳𝙰𝚃𝙴
║┃• 𝚂𝙴𝚃𝙿𝙿
║┃• 𝙲𝚁𝙴𝙰𝚃𝙴𝙶𝚁𝙾𝚄𝙿
║╰───────────────
╚━━━━━━━━━━━━━━━━━━╝

║➠ 𝙵𝚄𝙽
╔━━━━━━━━━━━━━━━━━━╗
║╭───────────────
║┃• 𝙲𝙾𝙼𝙿𝙻𝙸𝙼𝙴𝙽𝚃
║┃• 𝙸𝙽𝚂𝚄𝙻𝚃
║┃• 𝙵𝙻𝙸𝚁𝚃
║┃• 𝚃𝚁𝚄𝚃𝙷
║┃• 𝙳𝙰𝚁𝙴
║┃• 𝚂𝙷𝙸𝙿 @𝚄𝚂𝙴𝚁
║┃• 𝚁𝙰𝚃𝙴 @𝚄𝚂𝙴𝚁
║┃• 𝙲𝙰𝙻𝙲 10+2
║┃• 𝙴𝙼𝙾𝙹𝙸𝙼𝙸𝚇 1+2
║┃• 𝙲𝙷𝙰𝚁𝙰𝙲𝚃𝙴𝚁
║╰───────────────
╚━━━━━━━━━━━━━━━━━━╝

║➠ 𝙰𝙸
╔━━━━━━━━━━━━━━━━━━╗
║╭───────────────
║┃• 𝙶𝙿𝚃
║┃• 𝙶𝙴𝙼𝙸𝙽𝙸
║┃• 𝙸𝙼𝙰𝙶𝙸𝙽𝙴
║╰───────────────
╚━━━━━━━━━━━━━━━━━━╝

║➠ 𝚃𝙴𝚇𝚃𝙼𝙰𝙺𝙴𝚁
╔━━━━━━━━━━━━━━━━━━╗
║╭───────────────
║┃• 𝙼𝙴𝚃𝙰𝙻𝙻𝙸𝙲
║┃• 𝙽𝙴𝙾𝙽
║┃• 𝙼𝙰𝚃𝚁𝙸𝚇
║┃• 𝙶𝙻𝙸𝚃𝙲𝙷
║┃• 𝙵𝙸𝚁𝙴
║┃• 𝙿𝚄𝚁𝙿𝙻𝙴
║┃• 𝙷𝙰𝙲𝙺𝙴𝚁
║╰───────────────
╚━━━━━━━━━━━━━━━━━━╝

╔━━━⊷≫ 𝙲𝙷𝙰𝚃 𝙽𝙾𝙸𝚁-𝙼𝙳 ≪⊷━━━╗
║  © 𝙳𝙴𝚅 𝙼𝙸𝙲𝙷𝙰𝙴𝙻 𝚂𝙲𝙾𝙵𝙸𝙴𝙻𝙳
╚━━━━━━━━━━━━━━━━━━━━━━━━━━━╝`;

    // ── ENVOI ──
    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            await sock.sendMessage(
                chatId,
                {
                    image: imageBuffer,
                    caption: menuMessage,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363402057857053@newsletter",
                            newsletterName: "🐾CHAT NOIR-MD🐾",
                            serverMessageId: -1
                        }
                    }
                },
                { quoted: message }
            );
        } else {
            await sock.sendMessage(chatId, {
                text: menuMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363402057857053@newsletter",
                        newsletterName: "🐾CHAT NOIR-MD🐾",
                        serverMessageId: -1
                    }
                }
            });
        }

        const audioPath = path.join(__dirname, '../assets/menu_audio.mp3');
        if (fs.existsSync(audioPath)) {
            const audioBuffer = fs.readFileSync(audioPath);
            await sock.sendMessage(
                chatId,
                { audio: audioBuffer, mimetype: 'audio/mpeg', ptt: false },
                { quoted: message }
            );
        }

    } catch (error) {
        console.error("Erreur MENU:", error);
        await sock.sendMessage(chatId, { text: menuMessage });
    }
}

module.exports = menuCommand;