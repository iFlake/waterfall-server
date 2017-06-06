"use strict";

const LHTTP = require("http");

var mServer = null;

function MainClientHandler(request, response)
{
    (new module.parent.exports.LClient.Client(request, response)).Serve();
}

function Connect()
{
    for (var server in module.parent.exports.LConfigManager.mConfig.apiservers)
    {
        LHTTP.createServer(MainClientHandler).listen(module.parent.exports.LConfigManager.mConfig.apiservers[server].port, module.parent.exports.LConfigManager.mConfig.apiservers[server].ip);
    }
}

module.exports =
{
    Connect: Connect
}
