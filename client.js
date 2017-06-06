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
        if (request.method != "POST") return this.Error(400, "Method invalid");

        this.ParsePostData();
        
        module.parent.exports.LModules.Transfer(this);
    }

    ParsePostData()
    {
        var body;
        
        this.mRequest.on("data", function (chunk)
        {
            body += chunk;

            if (body.length > module.parent.exports.LConfigManager.mConfig.security.maxreqlength) this.Error(413, "Request too long",  "Maximum request length: " + module.parent.exports.LConfigManager.mConfig.security.maxreqlength + " bytes");
        });

        this.mRequest.on("end", function ()
        {
            try
            {
                this.mPost = JSON.parse(body);
            }
            catch (error)
            {
                Error(400, "Failed to parse JSON", "Exception: " + error);
            }
        });
    }

    Succeed(_data)
    {
        var data = _data || null;

        this.mResponse.writeHead(200,
        {
            "Content-Type": "text/json"
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
            "Content-Type": "text/json"
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
