const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../index');
const {MessageEmbed} = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data : new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Melange la queue.'),
        async execute(interaction) {  
            if (!interaction.member.voice.channel) {
                interaction.reply({content : 'Connectez vous a un salon vocal.', ephemeral : true});
            } else if (!interaction.guild.me.voice.channel) {
                interaction.reply({content : 'Je ne joue pas de musique.', ephemeral : true});
            } else if (interaction.member.voice.channel!==interaction.guild.me.voice.channel) {
                interaction.reply({content : 'Je joue de la musique ailleurs.', ephemeral : true})
            } else if (!client.distube.getQueue(interaction.guild.me.voice.channel)) {
                interaction.reply({content : `Il n'y a pas de musiques.`, ephemeral : true});
            } else {
                const shuffleEmbed = new MessageEmbed()
                .setColor('#00ff00')
                .setDescription(`Queue mélangée.`);
                try {
                    await client.distube.shuffle(interaction.guild.me.voice.channel);
                    await interaction.reply({embeds : [shuffleEmbed]});
                    await wait(3000);
                    await interaction.deleteReply();
                } catch (e) {
                    console.log(e);
                }
                
            }
        }
}