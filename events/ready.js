const config = require('../config')
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = {
    name:'ready',
    once:true,
    execute (client, commands) {
        console.log('Bot en ligne');
        

        const CLIENT_ID = client.user.id;

        const rest = new REST({
            version : "9"
        }).setToken(process.env.TOKEN);

        (async () => {
            await rest.put(Routes.applicationCommands(CLIENT_ID), {
                body: commands,
            }).then(console.log('Commandes enregistrés globalement !'));
        })();
        client.user.setActivity("ces bras cassés ...", {type : "WATCHING"});
    }
}