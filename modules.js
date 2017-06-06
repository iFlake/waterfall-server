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
    var _module = modules.indexOf(client.mPost.type);
    if (_module == -1) return client.Error(412, "Unknown module");

    (new modules[_module].Module(client)).Serve();
}

module.exports =
{
    LoadModules: LoadModules,
    Transfer: Transfer
}
