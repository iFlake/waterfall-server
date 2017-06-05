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

            if (body.length > module.parent.exports.LConfigManager.mConfig.security.maxreqlength)Error(413, "Request too long",  "Maximum request length: " + module.parent.exports.LConfigManager.mConfig.security.maxreqlength + " bytes");
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

    Error(httperrorcode, errorstring, description)
    {
        this.mREsponse.writeHead(httperrorcode,
        {
            "Content-Type": "text/json"
        });

        this.mResponse.write(JSON.stringify(
        {
            "success": false,
            "error": errorstring,
            "description": description || ""
        }));

        this.mResponse.end();
    }
}

module.exports =
{
    Client: Client
}
