const fs = require('fs');
const path = require('path');
const settings = require('../settings');

async function aliveCommand(sock, chatId, message) {
    try {
        const audioPath = path.join(__dirname, '../assets/alive.mp3');
        
        const aliveMessage = `
╔━━━⊷≫ 𝙲𝙷𝙰𝚃 𝙽𝙾𝙸𝚁-𝙼𝙳 ≪⊷━━━╗
║  ✨ *Le bot est opérationnel !* ✨
╠──────────────────╣

╔─⧉ *INFORMATIONS*
│ • *Version :* ${settings.version || '1.0.0'}
│ • *Statut :* 🟢 En ligne
│ • *Mode :* ${settings.self === true ? 'PRIVATE 🔒' : 'PUBLIC 🌍'}
╚──────────────────╝

╔─⧉ *FONCTIONNALITÉS*
│ • Gestion avancée des groupes
│ • Protection Antilink
│ • Commandes fun & automations
│ • Système intelligent optimisé
╚───────────────────╝

📌 *Tape .menu pour voir toutes les commandes.*

🐾 *CHAT NOIR-MD*
© DEV MICHAEL SCOFIELD
╚═══════════════════╝`;

        await sock.sendMessage(chatId, {
            text: aliveMessage,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363402057857053@newsletter",
                    newsletterName: "🐾CHAT NOIR-MD🐾",
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

        // ── AUDIO ──
        if (fs.existsSync(audioPath)) {
            await sock.sendMessage(chatId, {
                audio: fs.readFileSync(audioPath),
                mimetype: 'audio/mpeg',
                ptt: false
            }, { quoted: message });
        } else {
            console.log('Audio non trouvé :', audioPath);
        }

    } catch (error) {
        console.error('Erreur dans alive :', error);
        await sock.sendMessage(chatId, {
            text: '❌ Erreur lors de l\'exécution de la commande .alive'
        }, { quoted: message });
    }
}

module.exports = aliveCommand;