const client = require('../index');
const {MessageEmbed} = require('discord.js');
const wait = require('util').promisify(setTimeout);


let lastPlayingMessage = {};

function resetLastPlayingMessage(channelOfCommand) {
  try {
    channelOfCommand.messages.cache.get(lastPlayingMessage[channelOfCommand]).delete();
    delete lastPlayingMessage[channelOfCommand];
  } catch (e) {
    console.log(e);
  }
  
}
module.exports.resetLastPlayingMessage = resetLastPlayingMessage;

async function deleteQueueMessage(message, delay) {
  try {
    await wait(delay);
    await message.delete();
  } catch (e) {
    console.log(e);
  }
  
}



const status = queue =>
  `Volume: \`${queue.volume}%\` | Filtres: \`${queue.filters.join(', ') || 'Off'}\` | En: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) =>{
    const joueEmbed = new MessageEmbed()
    .setTitle('Je joue :')
    .setColor('#00ff00')
    .setDescription(`\`${song.name}\` - \`${song.formattedDuration}\` demandé par ${song.user}`);
    
    if (lastPlayingMessage[queue.textChannel]!==undefined) {
      queue.textChannel.messages.cache.get(lastPlayingMessage[queue.textChannel]).delete();
    }

    queue.textChannel.send({embeds : [joueEmbed]}).then(
      message => {
        lastPlayingMessage[message.channel] = message.id;
      }
    );
    
  })
  .on('addSong', (queue, song) => {
    const queueEmbed = new MessageEmbed()
    .setTitle(`J'ajoute à la queue :`)
    .setColor('#00ff00')
    .addFields(
      {name : "Musique :", value : `\`${song.name}\``, inline : true},
      {name : "Durée :", value : `\`${song.formattedDuration}\``, inline : true},
      {name : "\nPosition :", value : `${queue.songs.map((song ,id) => `${id}`)[queue.songs.length-1]}`},
      {name : "Demandé par :", value : `${song.user}`}
    )
    queue.textChannel.send({embeds : [queueEmbed]}).then(message => {
      deleteQueueMessage(message, 10000);
    })
  })
  .on('addList', (queue, playlist) => {
    const playlistEmbed = new MessageEmbed()
    .setTitle(`J'ajoute la playlist :`)
    .setColor('#00ff00')
    .setDescription("\`${playlist.name}\' (${playlist.songs.length} musiques) à la queue.")
    queue.textChannel.send({embeds : [playlistEmbed]}).then(message => {
      deleteQueueMessage(message, 10000);
    })
  })
  .on('error', (channel, e) => {
    const errorEmbed = new MessageEmbed()
    .setDescription(`Une erreur s'est produite.`)
    .setColor('#ff0000');
    channel.send({embeds : [errorEmbed]})
    console.error(e)
  })
  .on('empty', channel => {
    const emptyEmbed = new MessageEmbed()
    .setDescription('Le channel est vide, je le quitte...')
    .setColor("#0000ff");
    channel.textChannel.send({embeds : [emptyEmbed]}).then(message => {deleteQueueMessage(message, 3000)});
    resetLastPlayingMessage(channel.textChannel);
  })
  .on('searchNoResult', (message, query) =>
    message.channel.send(`Aucun résultat pour : \`${query}\`!`)
  )
  .on('finish', queue => {
    const finishEmbed = new MessageEmbed()
    .setColor('#0000ff')
    .setDescription('Plus de musique dans la queue');
    queue.textChannel.send({embeds : [finishEmbed]}).then( message => {deleteQueueMessage(message , 3000)});
    resetLastPlayingMessage(queue.textChannel)
  })

