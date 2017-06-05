"use strict";

console.log("Initializing Oxidane");

const LConfigManager   = require("./configmanager");
const LServer          = require("./server");
const LModules         = require("./modules");
const LGameServers     = require("./gameservers");

module.exports =
{
    LConfigManager: LConfigManager,
    LServer: LServer,
    LModules: LModules
}

module.exports.LConfigManager.LoadConfig();
module.exports.LServer.Connect();

console.log("Oxidane initialized");
