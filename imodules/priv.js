"use strict";

const LChildProcess    = require("child_process");

class Priv
{
    constructor (client)
    {
        this.mClient    = client;
    }

    Serve()
    {
        switch (this.mClient.mPost.command)
        {
            case "retrieveid": return this.ProcessRetrieveID();
            
            default: return this.mClient.Error(412, "Unknown command " + this.mClient.mPost.command);
        }
    }

    ProcessRetrieveID()
    {
        LChildProcess.exec("id -u " + this.mPost.parameters.uname, function (error, stdout, stderr)
        {
            if (error != null) return this.mClient.Error(500, "An error has occurred while attempting to get the user's UID: " + error);
            else if (stderr != "") return this.mClient.Error(500, "An error has occurred while attempting to get the user's UID: " + stderr);

            var uid = parseInt(stdout);

            LChildProcess.exec("id -g " + this.mPost.parameters.uname, function (error, stdout, stderr)
            {
                if (error != null) return this.mClient.Error(500, "An error has occurred while attempting to get the user's GID: " + error);
                else if (stderr != "") return this.mClient.Error(500, "An error has occurred while attempting to get the user's GID: " + stderr);

                var gid = parseInt(stdout);

                return this.mResponse.Succeed(
                {
                    uid: uid,
                    gid: gid
                });
            });
        });
    }
}

module.exports =
{
    Module: Priv
}
