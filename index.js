// import * as weechat from "weechat";
// import * as util from "util";
// import { createServer } from "http";
// import { Server } from "socket.io";

// import express from "express";
// import { setTimeout } from "timers/promises";
// const app = express();

const weechat = require("weechat");
const util = require("util");
const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const app = express();
require('dotenv').config()

app.use(express.static("./public"));
app.use(express.json());

const server = createServer(app);
const io = new Server(server);

var connections = {};

async function getBuffers(client) {
  return new Promise((resolve, reject) => {
    client.send("hdata buffer:gui_buffers(*) number,short_name,full_name,title,local_variables", function (buffers) {
      var pointers = {};
      // buffers.map(e => e.pointers);
      for (var i in buffers) {
        let buffer = buffers[i], pointer = buffer.pointers[0];
        pointers[pointer] = buffer.short_name;
      }

      resolve({
        pointers
      });
      // //console("done");
    });
  })
}

async function setup(client, socket) {
  var bufferName = {};

  client.send('info version', function (version) {
    //console("info")
    //console(version.value);
  });

  client.on('error', function (err) {
    console.error(err);
  });

  client.on('end', function () {
    //console('end');
  });

  client.on('line', function (line) {
    var from = weechat.noStyle(line.prefix);
    var message = weechat.noStyle(line.message);

    //console(bufferName[line.buffer], from, message);
    // //console(line)
    line = processLine(line);
    socket.emit("new:msg", line);
  });

  socket.on('message', function(bufferid, message) {
    client.send('input ' + bufferid + ' ' + message);
  });
  
  let buffers = await getBuffers(client);

  let { pointers } = buffers;
  bufferName = pointers;

  connections[socket.id] = {
    buffers,
    client,
    socket
  };

  return;
}

function sleep(ms){
  return new Promise((resolve)=>setTimeout(resolve, ms));
}

function getHdataValue(pointer){
  return new Promise((resolve) => {
    client.send(`hdata line:${pointer}/data`, e => {
      resolve(e);
    });
  });
}

io.on('connection', async (socket) => {
  //console('a user connected');
  var client = await connect();
  //console("connected to client");
  await setup(client, socket);
  socket.emit("init");

  socket.on("disconnect", () => {
    client.disconnect();
    delete connections[socket.id];
    //console("WeeClient closed");
  });
});

function processLine(e){
  let b = e;
  b["nick"] = weechat.noStyle(e.prefix);
  b.message = weechat.noStyle(e.message);
  return b;
}

app.post("/api/get_msg", authConnection, (req, res)=>{
  const { bufferid, count, id } = req.body
  var { client } = connections[id];

  var query = `hdata buffer:${bufferid}/own_lines/last_line(-${count})/data`;
  // //console(query)

  client.send(query, function (lines) {
    //console(lines);
    if (!Array.isArray(lines)) lines = [lines];
    lines = lines.reverse();
    lines = lines.map(processLine)
    // var messages = lines.reverse().map(getMessage).filter(function (message) {
    //   return message;
    // });
    // res.json(messages);
    // //console(messages);
    res.json(lines);
  });
});

function authConnection(req, res, next){
  const { id } = req.body;
  if( id in connections){
    console.log("connection found");
    next()
    return;
  }

  console.log("connection not found.");
  res.json({
    result: false
  });
}

app.post("/api/get_users", authConnection, (req, res)=>{
  const { bufferid, id } = req.body;

  const { client } = connections[id];

  client.send(`nicklist ${bufferid}`, function(users){
    if(!Array.isArray(users)) users = [users];
    users = users.filter(e=>e.group == 0);
    res.json(users);
    console.log(users);
  })
});

// function getMessage(line) {
//   if (typeof line.displayed !== 'undefined' && !line.displayed) return;

//   var date = new Date(parseInt(line.date, 10) * 1000);
//   var type = 'message';
//   var tags = line.tags_array;
//   if (!Array.isArray(tags)) tags = [];

//   ['join', 'part', 'quit', 'nick'].forEach(function(t) {
//     if (tags.indexOf('irc_' + t) >= 0) type = t;
//   });

//   var nick = tags.map(function(tag) {
//     var n = tag.match(/^nick_(\S+)/i);
//     return n && n.length >= 2 ? n[1] : null;
//   }).filter(function(nick) {
//     return nick;
//   });
//   nick = nick.length > 0 ? nick[0] : null;
//   var user = getUser(line.buffer, nick);

//   return {
//     bufferid: line.buffer,
//     from: weechat.style(line.prefix),
//     date: date,
//     type: type,
//     user: user,
//     highlight: !! line.highlight,
//     message: messageParts(line.message)
//   };
// }

// function messageParts(line) {
//   return weechat.style(line).map(function(part) {
//     return part;
//   });
// }

// function getUser(buffer, user) {
//   return {
//     title: user,
//     id: buffer + '-' + user
//   };
// }

app.post("/api/get_buffers",(req,res)=>{
  //console(`got request from ${req.body.id}`);
  if(req.body.id in connections){
    res.json(connections[req.body.id].buffers);
    return;
  }
  res.json({
  });
});

function connect() {
  return new Promise((resolve, reject) => {
    var client = weechat.connect(process.env.IP, process.env.PORT, process.env.PASSWD, false, function () {
      //console('Connected!');
      resolve(client);
    });
  });
}

console.log(process.env.IP)

server.listen(3000, () => {
  console.log('listening on *:3000');
});

// client.on(function() {
//   //console('Anything happened', arguments);
// });

// client.send("info version", (v)=>{
//   //console(v);
// })
