const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../index');
const {MessageEmbed} = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data : new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Continue de jouer la musique.'),
        async execute(interaction) {  
            if (!interaction.member.voice.channel) {
                interaction.reply({content : 'Connectez vous a un salon vocal.', ephemeral : true});
            } else if (!interaction.guild.me.voice.channel) {
                interaction.reply('Je ne joue pas de musique.');
            } else if (interaction.member.voice.channel!==interaction.guild.me.voice.channel) {
                interaction.reply({content : 'Je joue de la musique ailleurs.', ephemeral : true})
            } else if (!client.distube.getQueue(interaction.guild.me.voice.channel)) {
                interaction.reply(`Il n'y a pas de musique.`);
            } else {
                try{
                    const resumeEmbed = new MessageEmbed()
                    .setColor('#00ff00')
                    .setDescription(`Je continue de jouer la musique`);
                    await client.distube.resume(interaction.member.voice.channel);
                    await interaction.reply({embeds : [resumeEmbed]})
                    await wait(3000);
                    await interaction.deleteReply();
                } catch (e) {
                    const errorResumeEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setDescription('Je suis déja en train de jouer.');
                    await interaction.reply({embeds : [errorResumeEmbed], ephemeral : true});
                }
                
            }
        }
}