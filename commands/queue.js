const { SlashCommandBuilder } = require('@discordjs/builders');
const client = require('../index');
const {MessageEmbed} = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data : new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Liste les musiques de la queue.'),
        async execute(interaction) {  
            if (!interaction.member.voice.channel) {
                interaction.reply({content : 'Connectez vous à un channel vocal.',ephemeral : true});
            } else if (!interaction.guild.me.voice.channel) {
                interaction.reply('Je ne joue pas de musique.');
            } else if (interaction.member.voice.channel!==interaction.guild.me.voice.channel) {
                interaction.reply({content : `Je joue de la musique dans un channel différent.`, ephemeral : true});
            } else if (client.distube.getQueue(interaction.guild.me.voice.channel).songs.length<=1) {
                interaction.reply({content : `Il n'y a pas de prochaine musique.`, ephemeral : true});
            } else {
                try {
                    const queue = client.distube.getQueue(interaction.guild.me.voice.channel)
                    const queueEmbed = new MessageEmbed()
                    .setColor('#00ff00')
                    .setTitle(`Voici la liste des musiques :`)
                    .setDescription(queue.songs.map((song, id) => `**${id + 1}**. ${song.name} - \`${song.formattedDuration}\``
                    ).slice(0, 10).join("\n"));
                    await interaction.reply({embeds : [queueEmbed]});
                    await wait(10000);
                    await interaction.deleteReply();
                } catch(e) {
                    console.log(e);
                }  
            }
        }
}