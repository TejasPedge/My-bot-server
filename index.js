const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const app = express();

const {Telegraf} = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

app.use(cors());
app.use(express.json());



app.post('/portal/verify', async (req, res) => {

    try {

        let {chat_id} = req.body;
        let {group_id} = req.body;

        console.log('chat_id--------->>>', chat_id)

        if (!chat_id || !group_id) return res.status(400).send("chat id & group id is required");

        chat_id = Number(chat_id);

        group_id = Number(group_id);

        console.log('group id -------->>>>',group_id)

        const expireDate = Math.floor(Date.now() / 1000) + 60;

        const generate_invite_link = await bot.telegram.createChatInviteLink(group_id, expireDate, 1); // 1 is the limit of users that can join through the invite link

        // -------------------------Valid Link for one min -------------------------\\
        setTimeout(async () => {
            console.log('link expired====>>')
            await bot.telegram.revokeChatInviteLink(group_id, generate_invite_link?.invite_link);
        }, 60000);
        // ---------------------------------------------------------------------------\\

        console.log('generate_invite_link', generate_invite_link);

        const mesage = `<b>Verified, you can join the group using this temporary link:</b>

${generate_invite_link?.invite_link}    

This link is a one time use and will expire`;

        const url = 'https://img.freepik.com/free-photo/standard-quality-control-collage_23-2149631018.jpg?size=626&ext=jpg&ga=GA1.1.1458125422.1697875319&semt=ais';

        await bot.telegram.sendPhoto(chat_id, url,{
            caption : mesage,
            parse_mode : "HTML",
        });

        console.log(chat_id, '===========>>>.chat id');

        console.log('request body-------->>>>>', req.body);

        res.status(200).send("done");
        console.log('i run----');
    } catch (error) {
        console.log('error in verify API post request', error);
    }

});


app.listen(8181, () => {
    console.log('server is running on port 8181');
});



