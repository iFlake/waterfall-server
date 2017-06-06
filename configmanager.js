const LFileSystem = require("fs");

function LoadConfig()
{
    module.exports.mConfig = JSON.parse(LFileSystem.readFileSync("config.json"));
}

module.exports =
{
    LoadConfig: LoadConfig,
    mConfig: { }
};
