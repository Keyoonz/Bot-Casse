const { MessageEmbed} = require('discord.js')

module.exports = {
    name:'interactionCreate',
    once:false,
    async execute (interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return;

        try{
            
            await command.execute(interaction);
        
        } catch (err) {
            
            if (err) console.error(err);

            const erreurEmbed = new MessageEmbed()
            .setColor("#ff0000")
            .setDescription(`Une erreur c'est produite pendant l'éxécution de la commande.`);
            
            interaction.reply({embeds : [erreurEmbed], ephemeral : true});     

        }
    }
}