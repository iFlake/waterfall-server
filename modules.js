"use strict";

var modules = {};

function LoadModules()
{
    for (var _module in module.parent.exports.LConfigManager.mConfig.modules)
    {
        modules[module.parent.exports.LConfigManager.mConfig.modules[_module]] = require("./imodules/" + module.parent.exports.LConfigManager.mConfig.modules[_module]);
    }
}

function Transfer(client)
{
    var _module = modules[client.mPost.type];
    if (_module == undefined) return client.Error(412, "Unknown module");

    (new _module.Module(client)).Serve();
}

module.exports =
{
    LoadModules: LoadModules,
    Transfer: Transfer
}
