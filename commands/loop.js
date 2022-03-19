const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../index');
const {MessageEmbed} = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data : new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Active/désactive le mode loop.')
        .addSubcommand(subcommand => subcommand
            .setName('queue')
            .setDescription('Loop la queue.')
        )
        .addSubcommand(subcommand => subcommand
            .setName('song')
            .setDescription('Loop la musique.')
        )
        .addSubcommand(subcommand => subcommand
            .setName('off')
            .setDescription('Met le mode loop en off.')
        ),
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
                switch (interaction.options.getSubcommand()) {
                    case "song" :
                        const loopSongEmbed = new MessageEmbed()
                            .setDescription('La musique se joue en boucle.')
                            .setColor('#00ff00')
                        try {
                            await client.distube.setRepeatMode(interaction.member.voice.channel, 1);
                            await interaction.reply({embeds : [loopSongEmbed]});
                            await wait(3000);
                            await interaction.deleteReply();
                        } catch (e) {
                            console.log(e)
                        }
                        break;
                    case "queue" :
                        const loopQueueEmbed = new MessageEmbed()
                            .setDescription('La queue se joue en boucle.')
                            .setColor('#00ff00')
                            try {
                                await client.distube.setRepeatMode(interaction.member.voice.channel, 2);
                                await interaction.reply({embeds : [loopQueueEmbed]});
                                await wait(3000);
                                await interaction.deleteReply();
                            } catch (e) {
                                console.log(e)
                            }
                        break;
                    case "off" :
                        const loopOffEmbed = new MessageEmbed()
                            .setDescription('Le mode loop est désactivé.')
                            .setColor('#00ff00')
                            try {
                                await client.distube.setRepeatMode(interaction.member.voice.channel, 0);
                                await interaction.reply({embeds : [loopOffEmbed]});
                                await wait(3000);
                                await interaction.deleteReply();
                            } catch (e) {
                                console.log(e)
                            }
                        break;

                }
                
            }
        }
}