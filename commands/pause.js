const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../index');
const {MessageEmbed} = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data : new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Met la musique en pause.'),
        async execute(interaction) {  
            if (!interaction.member.voice.channel) {
                interaction.reply({content : 'Connectez vous a un salon vocal.', ephemeral : true});
            } else if (!interaction.guild.me.voice.channel) {
                interaction.reply('Je ne joue pas de musique.');
            } else if (interaction.member.voice.channel!==interaction.guild.me.voice.channel) {
                interaction.reply({content : 'Je joue de la musique ailleurs.', ephemeral : true})
            } else if (!client.distube.getQueue(interaction.guild.me.voice.channel)) {
                interaction.reply({content : `Il n'y a pas de musique.`, ephemeral : true});
            } else {
                try {
                    const pauseEmbed = new MessageEmbed()
                    .setColor('#00ff00')
                    .setDescription(`Je mets en pause la musique.`);
                    await client.distube.pause(interaction.member.voice.channel);
                    await interaction.reply({embeds : [pauseEmbed]});
                    await wait(3000);
                    interaction.deleteReply();
                } catch (e) {
                    try {
                        const errorPause = new MessageEmbed()
                    .setColor('#ff0000')
                    .setDescription('Je suis déja en pause.');
                    await interaction.reply({embeds : [errorPause], ephemeral : true})
                    } catch (e) {
                        console.log(e)
                    }
                    
                }
                
            }
        }
}