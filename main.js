/**
 * main.js
 * Traite les messages entrants WhatsApp et route vers les commandes.
 */
const settings = require('./settings')
const menuCommand = require('./commands/menuCommand')

async function handleMessages(sock, chatUpdate) {
    const message = chatUpdate.messages[0]
    if (!message?.message) return

    const chatId = message.key.remoteJid
    const body =
        message.message.conversation ||
        message.message.extendedTextMessage?.text ||
        message.message.imageMessage?.caption ||
        ''

    if (!body.startsWith(settings.prefix)) return

    const commandName = body.slice(settings.prefix.length).trim().split(/\s+/)[0].toLowerCase()

    switch (commandName) {
        case 'menu':
            await menuCommand(sock, chatId, message)
            break

        case 'ping':
            await sock.sendMessage(chatId, { text: '🏓 Pong !' }, { quoted: message })
            break

        case 'alive':
            await sock.sendMessage(chatId, { text: `✅ ${settings.botName} est en ligne.` }, { quoted: message })
            break

        default:
            // Commande inconnue : on ne répond rien pour éviter le spam
            break
    }
}

async function handleGroupParticipantUpdate(sock, update) {
    // Exemple minimal : message de bienvenue quand quelqu'un rejoint
    if (update.action !== 'add') return
    for (const participant of update.participants) {
        try {
            await sock.sendMessage(update.id, {
                text: `👋 Bienvenue @${participant.split('@')[0]} !`,
                mentions: [participant]
            })
        } catch (err) {
            console.error('Erreur message de bienvenue :', err.message)
        }
    }
}

async function handleStatus(sock, chatUpdate) {
    // Vu par défaut, ne fait rien de plus pour l'instant
    return
}

module.exports = { handleMessages, handleGroupParticipantUpdate, handleStatus }
