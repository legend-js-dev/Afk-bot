//afk bot coded by legend & ant >:D
const Client = require('./Structures/legendJsClient.js');
const Discord = require('discord.js');
require('./Structures/Message.js');
const { prefix, token } = require('./config.json');
//dont touch the credits or i will find you and u will have to commit die >:D
const client = new Client({
	disableMentions: 'everyone'
});
const format = require(`humanize-duration`);
const db = require('quick.db');
client.loadCommands();
console.log('-------------------------------------');
console.log(`
██╗     ███████╗ ██████╗ ███████╗███╗   ██╗██████╗         ██╗███████╗
██║     ██╔════╝██╔════╝ ██╔════╝████╗  ██║██╔══██╗        ██║██╔════╝
██║     █████╗  ██║  ███╗█████╗  ██╔██╗ ██║██║  ██║        ██║███████╗
██║     ██╔══╝  ██║   ██║██╔══╝  ██║╚██╗██║██║  ██║   ██   ██║╚════██║
███████╗███████╗╚██████╔╝███████╗██║ ╚████║██████╔╝██╗╚█████╔╝███████║
╚══════╝╚══════╝ ╚═════╝ ╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝ ╚════╝ ╚══════╝
`);

console.log('-------------------------------------');
console.log(
	'[CREDITS]: made by legend-js & ant | https://github.com/legend-js-dev | LΣGΣПD#0001 | ant#0768'
);
console.log('-------------------------------------');
//this took me some time so dont you dare remove credits, if u do remove credits then you will have copy right issues.
client.on('ready', () => {
	console.log(`[INFO]: Ready on client (${client.user.tag})`);
	console.log(
		`[INFO]: watching ${client.guilds.cache.size} Servers, ${
			client.channels.cache.size
		} channels & ${client.users.cache.size} users`
	);
	console.log('-------------------------------------');
	client.user.setActivity('afk bot by legend & ant :D', {
		type: 'WATCHING'
	});
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.guild) return;
	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const cmd = args.shift().toLowerCase();
	let command = client.commands.get(cmd);
	if (!command) command = client.commands.get(client.aliases.get(cmd));

	let status = db.get(`afkstatus_${message.guild.id}_${message.author.id}`);
	let reason;
	if (status === true) {
		db.set(`afkstatus_${message.guild.id}_${message.author.id}`, false);
		db.delete(`afk_${message.guild.id}_${message.author.id}`);
		message.member.setNickname(message.author.username).catch(err => {});
		return message.reply(`**Welcome Back**`);
	}
	if (message.mentions.users.size) {
		let mentions = message.mentions.users;
		mentions = mentions.filter(mention => mention.id !== message.author.id);
		if (mentions.size) {
			let victim = mentions.find(mention =>
				db.get(`afk_${message.guild.id}_${mention.id}`)
			);
			if (victim) {
			status = db.get(`afkstatus_${message.guild.id}_${victim.id}`);
			reason = db.get(`afk_${message.guild.id}_${victim.id}`);
				let time = db.get(`time_${message.guild.id}_${victim.id}`);
				time = Date.now() - time;
				return message.reply(
					`**${victim.username} is currently AFK - ${reason} - ${format(
						time
					)} ago**`
				);
			}
		}
	}
	if (command) {
		command.run(client, message, args, db);
	}
});

client.login(token).catch(err => {
	console.log('[ERROR]: Invalid Token Provided');
});
