const { setAntilink, getAntilink, removeAntilink } = require('../lib/index');
const isAdmin = require('../lib/isAdmin');
const settings = require('../settings');

const baseContext = {
    contextInfo: {
        externalAdReply: settings.adReply
    }
};

async function handleAntilinkCommand(sock, chatId, args, command, isGroup, message) {
    try {
        if (!isGroup) {
            await sock.sendMessage(chatId, {
                text: '❌ Cette commande est réservée aux groupes !'
            }, { quoted: message });
            return;
        }

        const prefix = '.';
        const fullArgs = args.join(' ').toLowerCase().trim();
        const action = fullArgs.split(' ')[0];

        if (!action) {
            const helpText = `
╔━━━⊷≫ 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 ≪⊷━━━╗
║  📌 Utilisation :
║  ${prefix}antilink on
║  ${prefix}antilink off
║  ${prefix}antilink set delete | kick | warn
║  ${prefix}antilink status
╚━━━━━━━━━━━━━━━━━━╝
`;
            await sock.sendMessage(chatId, { text: helpText, ...baseContext }, { quoted: message });
            return;
        }

        switch (action) {
            case 'on': {
                const existing = await getAntilink(chatId, 'on');
                if (existing?.enabled) {
                    await sock.sendMessage(chatId, {
                        text: 'ℹ️ Antilink est déjà activé.',
                        ...baseContext
                    }, { quoted: message });
                    return;
                }
                const result = await setAntilink(chatId, 'on', 'delete');
                await sock.sendMessage(chatId, {
                    text: result ? '✅ Antilink activé avec succès !' : '❌ Échec de l\'activation.',
                    ...baseContext
                }, { quoted: message });
                break;
            }

            case 'off': {
                await removeAntilink(chatId, 'on');
                await sock.sendMessage(chatId, {
                    text: '✅ Antilink désactivé avec succès !',
                    ...baseContext
                }, { quoted: message });
                break;
            }

            case 'set': {
                if (fullArgs.split(' ').length < 2) {
                    await sock.sendMessage(chatId, {
                        text: `❌ Utilisation : ${prefix}antilink set delete | kick | warn`,
                        ...baseContext
                    }, { quoted: message });
                    return;
                }
                const newAction = fullArgs.split(' ')[1];
                if (!['delete', 'kick', 'warn'].includes(newAction)) {
                    await sock.sendMessage(chatId, {
                        text: '❌ Action invalide. Choisissez delete, kick ou warn.',
                        ...baseContext
                    }, { quoted: message });
                    return;
                }
                const result = await setAntilink(chatId, 'on', newAction);
                await sock.sendMessage(chatId, {
                    text: result ? `✅ Action Antilink définie sur : ${newAction}` : '❌ Échec de la définition de l\'action Antilink.',
                    ...baseContext
                }, { quoted: message });
                break;
            }

            case 'status': {
                const status = await getAntilink(chatId, 'on');
                await sock.sendMessage(chatId, {
                    text: `
╔━━━⊷≫ 𝚂𝚃𝙰𝚃𝚄𝚂 𝙰𝙽𝚃𝙸𝙻𝙸𝙽𝙺 ≪⊷━━━╗
║  🔹 Statut : ${status?.enabled ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
║  🔹 Action : ${status?.action || 'Non définie'}
╚━━━━━━━━━━━━━━━━━━╝`,
                    ...baseContext
                }, { quoted: message });
                break;
            }

            default: {
                await sock.sendMessage(chatId, {
                    text: `❌ Commande invalide. Utilisez ${prefix}antilink pour voir les instructions.`,
                    ...baseContext
                }, { quoted: message });
            }
        }
    } catch (error) {
        console.error('Erreur dans la commande Antilink :', error);
        await sock.sendMessage(chatId, {
            text: '❌ Erreur lors du traitement de la commande Antilink.',
            ...baseContext
        }, { quoted: message });
    }
}

// ── DÉTECTION DES LIENS ──
async function handleLinkDetection(sock, chatId, msg, sender, isAdmin, getAntilinkStatus) {
    const antilinkData = getAntilinkStatus(chatId);
    if (!antilinkData || antilinkData === 'off') return;

    const linkPatterns = {
        whatsappGroup: /chat\.whatsapp\.com\/[A-Za-z0-9]{20,}/i,
        whatsappChannel: /wa\.me\/channel\/[A-Za-z0-9]{20,}/i,
        telegram: /t\.me\/[A-Za-z0-9_]+/i,
        allLinks: /https?:\/\/\S+|www\.\S+|(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/\S*)?/i
    };

    let hasLink = false;
    if (antilinkData === 'all' && linkPatterns.allLinks.test(msg)) {
        hasLink = true;
    } else if (antilinkData === 'whatsappGroup' && linkPatterns.whatsappGroup.test(msg)) {
        hasLink = true;
    } else if (antilinkData === 'whatsappChannel' && linkPatterns.whatsappChannel.test(msg)) {
        hasLink = true;
    } else if (antilinkData === 'telegram' && linkPatterns.telegram.test(msg)) {
        hasLink = true;
    } else if (antilinkData === 'allLinks' && linkPatterns.allLinks.test(msg)) {
        hasLink = true;
    }

    if (hasLink) {
        try {
            // Supprimer le message
            await sock.sendMessage(chatId, {
                delete: {
                    remoteJid: chatId,
                    fromMe: false,
                    id: msg.key.id,
                    participant: msg.participant || sender
                }
            });

            // Envoyer un avertissement
            await sock.sendMessage(chatId, {
                text: `⚠️ @${sender.split('@')[0]}, poster des liens est interdit !`,
                mentions: [sender],
                ...baseContext
            });
        } catch (error) {
            console.error('Erreur suppression message Antilink :', error);
        }
    }
}

module.exports = {
    handleAntilinkCommand,
    handleLinkDetection
};