const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../index');
const {MessageEmbed} = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data : new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Joue la musique suivante.'),
        async execute(interaction) {  
            if (!interaction.member.voice.channel) {
                interaction.reply({content : 'Connectez vous à un channel vocal.',ephemeral : true});
            } else if (!interaction.guild.me.voice.channel) {
                interaction.reply('Je ne joue pas de musique.');
            } else if (interaction.member.voice.channel!==interaction.guild.me.voice.channel) {
                interaction.reply({content : `Je joue de la musique dans un channel différent.`, ephemeral : true});
            } else if (client.distube.getQueue(interaction.guild.me.voice.channel).songs.length<=1) {
                interaction.reply({content :`Il n'y a pas de prochaine musique.`, ephemeral : true});
            } else {
                try {
                    const skipEmbed = new MessageEmbed()
                    .setColor('#00ff00')
                    .setDescription('Je joue la musique suivante.');
                    await client.distube.skip(interaction.member.voice.channel);
                    await interaction.reply({embeds : [skipEmbed]});
                    await wait(3000);
                    await interaction.deleteReply();
                } catch(e) {
                    console.log(e);

                }  
            }
        }
}