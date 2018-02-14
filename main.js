const request = require('request');
const Discord = require("discord.js");
const msecConverter = require("microseconds");
const bot = new Discord.Client();
var fs = require('fs');
var bitcoin_rpc = require('node-bitcoin-rpc');
//var config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
bitcoin_rpc.init('127.0.0.1', '17735', 'yiimprpc', 'CBAGYeKOK9Acb1ed8S44tQ')

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    setInterval(SetCurrentRate, 60 * 1000);
    SetCurrentRate();

    setInterval(UpdateData, 60 * 1000);
    UpdateData();
});

bitcoin_rpc.call('getmininginfo', [], function (err, res) {
    if (err) {
        let errMsg = "Error when calling bitcoin RPC: " + err;
        console.log(errMsg);
        throw new Error(errMsg);
    } else if (res.error) {
        let errMsg = "Error received by bitcoin RPC: " + res.error.message + " (" + res.error.code + ")";
        console.log(errMsg);
        throw new Error(errMsg);
    } else {
        var ttf = calcTTF(1812,215)
        //var convertedTime = msecConverter.parse(ttf);
        console.log('Network Hashrate: ' + convertHashRate(res.result.networkhashps));
        console.log('Difficulty: ' + pRound(res.result.difficulty, 2));
        console.log(ttf);
        //console.log('TTF ' + convertedTime.days + " " +  convertedTime.hours + " " + convertedTime.minutes);

    }
})

function calcTTF(diff, hash) {
    var msec = diff * 2**32 / hash;
    var ttf = msecConverter.parse(msec);
    if (ttf.days !== 0) {
        return ttf.days + " Days";
    }
    else if (ttf.hours !== 0) {
        return ttf.hours + " Hours"
    }
    else if (ttf.minutes !== 0) {
        return ttf.minutes + " Minutes";
    }
    else {
        return ttf.seconds + " Seconds";
    }
}

function convertHashRate(hashrate) {
    var h = '';
    if (hashrate >= 1000*1000*1000*1000*1000) {
        h = pRound(hashrate/1000/1000/1000/1000/1000, 1) + " Ph/s";
    }
    else if (hashrate >= 1000*1000*1000*1000) {
        h = pRound(hashrate/1000/1000/1000/1000, 1) + " Th/s";
    }
    else if (hashrate >= 1000*1000*1000) {
        h = pRound(hashrate/1000/1000/1000, 1) + " Gh/s";
    }
    else if (hashrate >= 1000*1000) {
        h = pRound(hashrate/1000/1000, 0) + " Mh/s";
    }
    else if (hashrate >= 1000) {
        h = pRound(hashrate/1000, 0) + " h/s";
    }
    else {
        h = pRound(hashrate, 0);
    }
    return h;
}

function pRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

  