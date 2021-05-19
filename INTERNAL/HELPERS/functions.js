const Discord = require("discord.js");
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const Commands = require('../MODELS/Base/Commands');
const idc = require('shortid');
module.exports = {

    async findCommand(name) {
        let commandData = await Commands.findOne({ name: name });
        return commandData
    },

    comparedate(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff);
        return days;
    },
    checkSecs(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 1000);
        return days / 60;
    },
    checkMins(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let secs = Math.floor(diff / 60000);
        return secs;
    },

    async createCommand(name, datam) {
        const id = idc.generate();
        datam._id = id;
        let commandData = await Commands.findOne({ name: name });
        if (!commandData) {
            try {
                let cmd = new Commands(datam);
                await cmd.save();
            } catch (error) {
                console.log(error);
            }
        }
        commandData = await Commands.findOne({ name: name });
        return commandData
    },
    /**
     * Gets the users data
     * @param {object} client The discord client
     * @param {array} users The users to gets data
     * @returns The users data
     */
    async getUsersData(client, users) {
        return new Promise(async function (resolve, reject) {
            let usersData = [];
            for (let u of users) {
                let result = await client.usersData.find({ id: u.id });
                if (result[0]) {
                    usersData.push(result[0]);
                } else {
                    let user = new client.usersData({
                        id: u.id
                    });
                    await user.save();
                    usersData.push(user);
                }
            }
            resolve(usersData);
        });
    },

    /**
     * Gets message prefix
     * @param {object} message The Discord message
     * @returns The prefix
     */
    getPrefix(message, data) {
        if (message.channel.type !== "dm") {
            const prefixes = [
                `<@${message.client.user.id}>`,
                data.config.botname,
                data.guild.prefix
            ];
            let prefix = null;
            prefixes.forEach((p) => {
                if (message.content.startsWith(p)) {
                    prefix = p;
                }
            });
            return prefix;
        } else {
            return true;
        }
    },

    welcomeMsg(member, durum) {
        let embed = new Discord.MessageEmbed()
            .setColor("#2f3136")
            .setTitle("Sunucuya Katıldı!")
            .addField("Oluşturulma tarihi: ", member.user.createdAt.toUTCString().substr(0, 16), true)
            .addField("Kullanıcı Adı:", member.user.username, true)
            .addField("Discriminator:", member.user.discriminator, true)
            .addField("\u200B", "\u200B", false)
            .addField("ID:", member.user.id, true)
            .addField("Kullanıcı:", durum, true)
            .addField("Durumu:", member.user.presence.status, true)
            .setDescription(`${member} sunucumuza katıldı!`)
            .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 1024 }));
        return embed;
    },

    // This function sort an array 
    sortByKey(array, key) {
        return array.sort(function (a, b) {
            let x = a[key];
            let y = b[key];
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    },

    // This function return a shuffled array
    shuffle(pArray) {
        let array = [];
        pArray.forEach(element => array.push(element));
        let currentIndex = array.length, temporaryValue, randomIndex;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    // This function return a random number between min and max
    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    rain(client, sayi) {
        const emojis = low(client.adapters('emojis')).get("numbers").value();
        var basamakbir = sayi.toString().replace(/ /g, "     ");
        var basamakiki = basamakbir.match(/([0-9])/g);
        basamakbir = basamakbir.replace(/([a-zA-Z])/g, "bilinmiyor").toLowerCase();
        if (basamakiki) {
            basamakbir = basamakbir.replace(/([0-9])/g, d => {
                return {
                    "0": emojis.sfr,
                    "1": emojis.bir,
                    "2": emojis.iki,
                    "3": emojis.uch,
                    "4": emojis.drt,
                    "5": emojis.bes,
                    "6": emojis.alt,
                    "7": emojis.ydi,
                    "8": emojis.sks,
                    "9": emojis.dkz
                }[d];
            });
        }
        return basamakbir;
    },

    sayi(anan) {
        var reg = new RegExp("^\\d+$");
        var valid = reg.test(anan);
        return valid;
    },

    checkDays(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 86400000);
        return days;
    },

    checkHours(date) {
        let now = new Date();
        let diff = now.getTime() - date.getTime();
        let days = Math.floor(diff / 3600000);
        return days;
    },

    getPath(obj, value, path) {

        if (typeof obj !== 'object') {
            return;
        }

        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var t = path;
                var v = obj[key];
                if (!path) {
                    path = key;
                }
                else {
                    path = path + '.' + key;
                }
                if (v === value) {
                    return path.toString();
                }
                else if (typeof v !== 'object') {
                    path = t;
                };
                var res = this.sayi(v, value, path);
                if(res) {
                    return res;
                } 
            }
        }

    },

    async closeall(obj, permes) {
        obj.roles.cache.filter(rol => rol.editable).filter(rol => permes.some(xd => rol.permissions.has(xd))).forEach(async (rol) => rol.setPermissions(0));
    },

    trstats(word) {
        let gotkokuyor = "";
        if (word === 'dnd') {
            gotkokuyor = 'Rahatsız Etmeyin';
        } else if (word === 'online') {
            gotkokuyor = "Çevrimiçi";
        } else if (word === 'idle') {
            gotkokuyor = 'Boşta';
        } else {
            gotkokuyor = 'Çevrimdışı';
        }

        return gotkokuyor;
    }

};

