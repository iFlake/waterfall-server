"use strict";

class Client
{
    constructor (request, response)
    {
        this.mRequest     = request;
        this.mResponse    = response;

        this.mIP          = request.connection.remoteAddress;

        this.mPost        = { };
    }

    Serve()
    {
        if (this.mRequest.method != "POST") return this.Error(400, "Method invalid");

        var _this = this;

        this.ParsePostData(function ()
        {
            module.parent.exports.LModules.Transfer(_this);
        });
    }

    ParsePostData(callback)
    {
        var _this = this;

        var body = "";
        
        this.mRequest.on("data", function (chunk)
        {
            body += chunk;

            if (body.length > module.parent.exports.LConfigManager.mConfig.security.maxreqlength) this.Error(413, "Request too long",  "Maximum request length: " + module.parent.exports.LConfigManager.mConfig.security.maxreqlength + " bytes");
        });

        this.mRequest.on("end", function ()
        {
            try
            {
                _this.mPost = JSON.parse(body);
            }
            catch (error)
            {
                return _this.Error(400, "Failed to parse JSON", "Exception: " + error);
            }

            callback();
        });
    }

    Succeed(_data)
    {
        var data = _data || null;

        this.mResponse.writeHead(200,
        {
            "Content-Type": "application/json"
        });

        this.mResponse.end(JSON.stringify(
        {
            "success": "true",
            "return": data
        }));
    }

    Error(httperrorcode, errorstring, description)
    {
        this.mResponse.writeHead(httperrorcode,
        {
            "Content-Type": "application/json"
        });

        this.mResponse.end(JSON.stringify(
        {
            "success": false,
            "error": errorstring,
            "description": description || ""
        }));
    }
}

module.exports =
{
    Client: Client
}
