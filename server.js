const express = require('express')
const app = express()
const axios = require('axios')
const bodyParser = require('body-parser')
const packageInfo = require('./package.json');
const Bot = require('node-telegram-bot-api');

require('dotenv').config()
const { TOKEN, SERVER_URL, NODE_ENV } = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL + URI

var bot;

if(NODE_ENV === 'production') {
  bot = new Bot(TOKEN);
  bot.setWebHook(WEBHOOK_URL);
}
else {
  bot = new Bot(TOKEN, { polling: true });
}


app.use(bodyParser.json())

//   const init = async () => {
//     const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
//     console.log(res.data)
// }


app.get('/', (req,res)=>{
  res.json({ version: packageInfo.version });
})


app.post(URI, (req, res) => {
   
    try {
        bot.processUpdate(req.body);
        res.sendStatus(200);
            }
     
    catch (error) {
        console.error(error.message);
    }
    
})


var new_list = {
  name: "",
  email: "",
  number: 0
}

bot.on('message', async(msg) => {
  const chatId = msg.chat.id;
  commands1 = '/start';
  commands2 = '/name';
  commands3 = '/email';
  commands4 = '/phone';
  commands5 = '/display';
	const input = msg.text;
  try {
    
    if (commands1.includes(input)) {
      await bot.sendMessage(
        msg.chat.id,
        `Welcome!\n
        - Enter your name, phone and email address\n
        -/name for entering name
        -/email for entering email
        -/phone for entering number
        -/display for displaying details`,
        { parse_mode: 'HTML', disable_web_page_preview: true }
      );
      }
  
      if(input.includes(commands2)){
         name = input.split('/name')[1].trim();
         if(name === '')
         {
            text = "please enter a name";
         }
         
         else
         {
           text = "entered name";
           new_list.name = name;
         }
          
        
         await bot.sendMessage(
          msg.chat.id,
          text,
          { parse_mode: 'HTML', disable_web_page_preview: true }
        );
      }
  
      if(input.includes(commands3)){
        email = input.split('/email')[1].trim();
        if(email === '')
        {
           text = "please enter a email";
        }

        if(! email.includes('@') && !email.includes('.com'))
          {
            text = "enter valid email address"
          }
        else
        {
          text = "entered email";
          new_list.email = email;
        }
         
       
        await bot.sendMessage(
         msg.chat.id,
         text,
         { parse_mode: 'HTML', disable_web_page_preview: true }
       );
     }
     if(input.includes(commands4)){
      number = input.split('/phone')[1].trim();
      if(number === '')
         {
            text = "please enter a number";
         }

        if(number.length !=10)
        {
          text = "please enter valid phone number";
        }
         else
         {
           text = "entered number";
           new_list.number = number;

         }
          
        
         await bot.sendMessage(
          msg.chat.id,
          text,
          { parse_mode: 'HTML', disable_web_page_preview: true }
        );
   }
  
   if(commands5.includes(input)){
   await bot.sendMessage(
      msg.chat.id,
      `Hi ${new_list.name}, your email is ${new_list.email}, and your phone number is ${new_list.number}`,
      { parse_mode: 'HTML', disable_web_page_preview: true }
    );
   }
  } catch (error) {
    console.error(error.message);
  }

});
app.listen(process.env.PORT || 3000 , ()=>{
      
    try {
      console.log(`appplication running in port ${process.env.PORT || 3000}`);
      console.log('bot server started...');
    } 
    catch (error) {
        console.error(error.message);
    }
})


