const { SlashCommandBuilder } = require('@discordjs/builders');
const clientDiscord = require('../index');
const {MessageEmbed} = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data : new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Donne le ping du bot.'),
        async execute(interaction) {
            const pingEmbed = new MessageEmbed()
            .setColor('#00ff00') 
            .setDescription(`Pong ! (${clientDiscord.ws.ping}ms)`)
            try {
                await interaction.reply({embeds : [pingEmbed]});
                await wait(10000);
                await interaction.deleteReply();
            } catch (e) {
                console.log(e);
            }
        }
}