"use strict";

console.log("Initializing waterfall");

const LConfigManager   = require("./configmanager");
const LServer          = require("./server");
const LClient          = require("./client");
const LModules         = require("./modules");
const LGameServers     = require("./gameservers");

module.exports =
{
    LConfigManager: LConfigManager,
    LServer: LServer,
    LClient: LClient,
    LModules: LModules
}

module.exports.LConfigManager.LoadConfig();
module.exports.LServer.Connect();
module.exports.LModules.LoadModules();

console.log("Initialized");
