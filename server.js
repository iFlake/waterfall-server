"use strict";

const LHTTP = require("http");
const LClient = require("./client");

function MainClientHandler(request, response)
{
    (new LClient.Client(request, response)).Serve();
}

var mServer = LHTTP.createServer(MainClientHandler);

for (server in module.parent.exports.LConfigManager.mConfig.apiservers)
{
    mServer.createServer(MainClientHandler).listen(module.parent.exports.LConfigManager.mConfig.apiservers[server].port, module.parent.exports.LConfigManager.mConfig.apiservers[server].ip);
}
