const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../index');
const reset = require('../events/DistubeEvents');
const {MessageEmbed} = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data : new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Arrete de jouer de la musique.'),
        async execute(interaction) {  
            if (!interaction.member.voice.channel) {
                interaction.reply({content : 'Connectez vous a un salon vocal.', ephemeral : true});
            } else if (!interaction.guild.me.voice.channel) {
                interaction.reply('Je ne joue pas de musique.');
            } else if (interaction.member.voice.channel!==interaction.guild.me.voice.channel) {
                interaction.reply({content : 'Je joue de la musique ailleurs.', ephemeral : true})
            } else {
                const stopEmbed = new MessageEmbed()
                    .setColor("#00ff00")
                    .setDescription(`J'arrete de jouer de la musique`);
                reset.resetLastPlayingMessage(interaction.channel);
                try {
                    await interaction.reply({embeds : [stopEmbed]})
                    await client.distube.stop(interaction.member.voice.channel);
                    await wait(3000);
                    await interaction.deleteReply();
                } catch (e) {
                    console.log(e);
                }
                
            }
        }
}