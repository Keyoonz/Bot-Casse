const { SlashCommandBuilder } = require('@discordjs/builders');
const clientDiscord = require('../index');
const {MessageEmbed} = require('discord.js');
const wait = require('util').promisify(setTimeout);

module.exports = {
    data : new SlashCommandBuilder()
        .setName('help')
        .setDescription('Donne la liste de toute les commandes.'),
        async execute(interaction) {
            const helpEmbed = new MessageEmbed()
            .setColor('#00ff00') 
            .setTitle('Voici la liste de toute les commandes :')
            .setDescription(`- **help :** donne la liste de toute les commandes\n- **ping :** donne le ping du bot\n- **play :** joue la musique spécifiée\n- **stop :** arrete de jouer de la musique\n- **skip :** joue la musique suivante\n- **pause :** met la musique en pause\n- **resume :** continue de jouer de la musique\n- **queue :** liste les musiques de la queue\n- **shuffle :** melange la queue\n- **loop (song/queue/off) :** active/désactive le mode loop\n- **volume :** regle le volume du bot`)
            .addFields({name : "Voir la liste ici :", value : `\`https://github.com/Keyoonz/Bot-Casse#Commandes\``, inline : true})
            try {
                await interaction.reply({embeds : [helpEmbed]});
                await wait(10000);
                await interaction.deleteReply();
            } catch (e) {
                console.log(e);
            }
        }
}