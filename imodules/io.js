"use strict";

const LFileSystem    = require("fs");

class IO
{
    constructor (client)
    {
        this.mClient    = client;
    }

    Serve()
    {
        switch (this.mClient.mPost.command)
        {
            case "createfile": return this.ProcessCreateFile();
            case "renamefile": return this.ProcessRenameFile();
            
            default: return this.mClient.Error(412, "Unknown command " + this.mClient.mPost.command);
        }
    }

    ProcessCreateFile()
    {
        var truepath;

        if (this.mClient.mPost.parameters.relative === true) truepath = module.parent.exports.LConfigManager.mConfig.systemdir + "/" + this.client.mPost.parameters.path;
        else truepath = this.client.mPost.parameters.path;

        LFileSystem.open(truepath, "wx", function (error, descriptor)
        {
            if (error != null)
            {
                switch (error.code)
                {
                    case "EEXIST": return this.mClient.Error(409, "The file already exists");
                    case "EACCES": return this.mClient.Error(403, "Access rejected");
                    case "EPERM": return this.mClient.Error(500, "Insufficient permissions");
                    case "EMFILE": return this.mClient.Error(409, "Maximum file descriptors exceeded");

                    default: return this.mClient.Error(500, "An error has occurred while trying to create the file: " + error.code);
                }
            }

            fs.close(descriptor, function (error)
            {
                if (error != null) return this.mClient.Error(500, "An error has occurred while trying to close the file: " + error.code);

                return this.mClient.Succeed();
            });
        });

        return;
    }

    ProcessRenameFile()
    {
        var truepath;

        if (this.mClient.mPost.parameters.relative === true) truepath = module.parent.exports.LConfigManager.mConfig.systemdir + "/" + this.client.mPost.parameters.path;
        else truepath = this.client.mPost.parameters.path;

        var truetargetpath;

        if (this.mClient.mPost.parameters.targetrelative === true) truetargetpath = module.parent.exports.LConfigManager.mConfig.systemdir + "/" + this.client.mPost.parameters.targetpath;
        else truetargetpath = this.client.mPost.parameters.targetpath;

        LFileSystem.rename(truepath, truetargetpath, function (error)
        {
            if (error != null)
            {
                switch (error.code)
                {
                    case "ENOENT": return this.mClient.Error(404, "Inexistent file");
                    case "EACCES": return this.mClient.Error(403, "Access rejected");
                    case "EPERM": return this.mClient.Error(500, "Insufficient permissions");
                    case "EMFILE": return this.mClient.Error(409, "Maximum file descriptors exceeded");

                    case "EXDEV":
                        LFileSystem.readFile(truepath, function (error, data)
                        {
                            if (error != null)
                            {
                                switch (error.code)
                                {
                                    case "ENOENT": return this.mClient.Error(404, "Inexistent file");
                                    case "EACCES": return this.mClient.Error(403, "Access rejected");
                                    case "EPERM": return this.mClient.Error(500, "Insufficient permissions");
                                    case "EMFILE": return this.mClient.Error(409, "Maximum file descriptors exceeded");

                                    default: return this.mClient.Error(500, "An error has occurred while trying to read the file: " + error.code);
                                }
                            }

                            LFileSystem.writeFile(truetargetpath, data, function (error)
                            {
                                if (error != null)
                                {
                                    switch (error.code)
                                    {
                                        case "ENOENT": return this.mClient.Error(404, "Inexistent file");
                                        case "EACCES": return this.mClient.Error(403, "Access rejected");
                                        case "EPERM": return this.mClient.Error(500, "Insufficient permissions");
                                        case "EMFILE": return this.mClient.Error(409, "Maximum file descriptors exceeded");

                                        default: return this.mClient.Error(500, "An error has occurred while trying to write to the file: " + error.code);
                                    }
                                }

                                LFileSystem.unlink(truepath, function (error)
                                {
                                    if (error != null)
                                    {
                                        switch (error.code)
                                        {
                                            case "ENOENT": return this.mClient.Error(404, "Inexistent file");
                                            case "EACCES": return this.mClient.Error(403, "Access rejected");
                                            case "EPERM": return this.mClient.Error(500, "Insufficient permissions");
                                            case "EMFILE": return this.mClient.Error(409, "Maximum file descriptors exceeded");

                                            default: return this.mClient.Error(500, "An error has occurred while trying to delete the file: " + error.code);
                                        }
                                    }

                                    return this.mClient.Succeed();
                                });
                            });
                        });

                        return;

                    default: return this.mClient.Error(500, "An error has occurred while trying to rename the file: " + error.code);
                }
            }

            return this.mClient.Succeed();
        });

        return;
    }
}

module.exports =
{
    Module: IO
}
