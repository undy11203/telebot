const TelegramApi = require('node-telegram-bot-api')
const token = '1893201307:AAFnBI1HgOH1YgbTBVMzpWkWbco3G5Aqgxg'
const {gameOptions, againOptions} = require('./options')
const bot = new TelegramApi(token, {polling:true})

const chats = {}

const start = () =>{
    bot.setMyCommands([
        {command: '/start', description:'Начальное приветсвие'},
        {command: '/info', description:'Получить информацию'},
        {command: '/game', description:'Игра'},
    ])
    const startGame = async (chatId) =>{
        await bot.sendMessage(chatId, `Сейсас загадаю число от 0 до 9`)
        const randomNumber = Math.floor(Math.random() * 10)
        chats[chatId] = randomNumber
        await bot.sendMessage(chatId, `Отгадай`, gameOptions)
    }

    bot.on('message', async msg => {
        const text = msg.text
        const chatId = msg.chat.id    
    
        if(text === '/start'){
            return bot.sendMessage(chatId, 'Добро пожаловать')
        }
        if(text === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут  ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if(text === '/game'){
            return startGame(chatId)
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю')
    })

    bot.on('callback_query', async msg =>{
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again'){
            return startGame(chatId)
        }
        
        if(data === chats[chatId]){
            return bot.sendMessage(chatId, `Ты угадал, это ${chats[chatId]}`, againOptions)
        }else{
            return bot.sendMessage(chatId, `Ты не угодал, это ${chats[chatId]}`, againOptions)
        }
    })
}
start()