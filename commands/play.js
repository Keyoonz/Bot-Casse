const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../index');
const {MessageEmbed} = require('discord.js');
const wait = require('util').promisify(setTimeout);


module.exports = {
    data : new SlashCommandBuilder()
        .setName('play')
        .setDescription('Joue la musique spécifiée')
        .addStringOption(option => option
            .setName('musique')    
            .setDescription('Spécifiez la musique.')
            .setRequired(true)
        ),
        async execute(interaction) {  
            if (!interaction.member.voice.channel) {
                interaction.reply({content : 'Connectez vous à un channel vocal.',ephemeral : true});
            } else if (interaction.member.voice.channel!==interaction.guild.me.voice.channel && interaction.guild.me.voice.channel) {
                interaction.reply({content : `Je joue déja de la musique dans un channel différent.`, ephemeral : true});
            } else {
                try {
                    const playEmbed = new MessageEmbed()
                    .setColor('#00ff00')
                    .setDescription( `Je recherche : "${interaction.options.getString('musique')}"`)
                    client.distube.play(interaction.member.voice.channel, interaction.options.getString("musique"), 
                    {textChannel: interaction.channel, member: interaction.member});
                    await interaction.reply({embeds : [playEmbed]});
                    await wait(3000);
                    await interaction.deleteReply();
                } catch(e) {
                    console.log(e)
                }  
            }
        }
}