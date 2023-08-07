require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const TelegramApi = require("node-telegram-bot-api");

const token = process.env.BOT_TOKEN;
const openaiApiKey = process.env.GPT_KEY;

const bot = new TelegramApi(token, { polling: true });

const configuration = new Configuration({
    apiKey: openaiApiKey,
});

const openai = new OpenAIApi(configuration);


// Set up the Telegram bot
const botActions = () => {
    bot.on("message", async (msg) => {
      const text = msg.text;
      const chatId = msg.chat.id;
  
      try {
        if (text === "/start") {
            bot.sendMessage(chatId, 'Hello! I am your chatbot. Type anything to start a conversation.');
        } else {
            try {
                // Send user message to GPT-3 and receive a response
                const gptResponse = await openai.createCompletion({
                    model: 'gpt-3.5-turbo', // Use the davinci engine for completions
                    prompt: text,
                    max_tokens: 50, // Adjust the response length as needed
                });
        
                const botResponse = gptResponse.choices[0].text.trim();
        
                // Send the response back to the user
                bot.sendMessage(chatId, botResponse);
            } catch (error) {
                console.error('Error:', error.response.data);
                bot.sendMessage(chatId, 'An error occurred while processing your request.');
            }
        }
      } catch (e) {
        console.log(e);
        return bot.sendMessage(chatId, "Ой! Произошла серьезная ошибка!");
      }
    });
  };
  
  botActions();


