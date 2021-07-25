const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = "1948399581:AAES1V09a2HT28dsCx6GycQwSvIj_Oe5Le4"

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать!`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Попробуй отгадать!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: `/start`, description: `Начальное приветствие`},
        {command: `/info`, description: `Получить информацию о пользователе (имя)`},
        {command: `/game`, description: `Игра "Угадай цифру"`}
    ])
    
    bot.on(`message`, async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === `/start`) {
            await bot.sendSticker(chatId, `https://tlgrm.eu/_/stickers/8a1/9aa/8a19aab4-98c0-37cb-a3d4-491cb94d7e12/2.webp`)
            return bot.sendMessage(chatId, `Добро пожаловать `)
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} `);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз!`)
    
    })

    bot.on('callback_query', async msg =>{
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === `/again`) {
            return startGame(chatId)
        }
        if(data == chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру, это и в самом деле ${chats[chatId]}! Нажми кнопку внизу, чтобы попробовать ещё раз.`, againOptions)
        } else {
            return bot.sendMessage(chatId, `К сожалению ты не угадал, я загадал цифру ${chats[chatId]}. Попробуй ещё раз.`, againOptions)
        }
    })
}


start()