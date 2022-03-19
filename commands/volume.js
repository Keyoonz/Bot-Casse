const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../index');
const {MessageEmbed} = require('discord.js');
const wait = require('util').promisify(setTimeout);


module.exports = {
    data : new SlashCommandBuilder()
        .setName('volume')
        .setDescription('change le volume de la musique.')
        .addIntegerOption(option => option
            .setName('pourcents')
            .setDescription('Spécifiez le nombre de pourcents.')
            .setRequired(true)
            .setMaxValue(100)
            .setMinValue(1)
        ),
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
                const volumeEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setDescription(`Le volume est maintenant de ${interaction.options.getInteger('pourcents')}%.`);
                try {
                    await client.distube.setVolume(interaction.guild.me.voice.channel, interaction.options.getInteger('pourcents'));
                    await interaction.reply({embeds : [volumeEmbed]});
                    await wait(3000);
                    await interaction.deleteReply();
                } catch (e) {
                    console.log(e);
                }
               
            }
        }
}