const LChildProcess    = require("child_process");
const LFileSystem      = require("fs");

class GameServer
{
    constructor (executable, logfile, clparameters, allowedports, identity)
    {
        this.mExecutable               = executable;
        this.mLogFile                  = logfile;
        this.mCommandLineParameters    = clparameters;
        this.mPorts                    = ports;
        this.mIdentity                 = identity;

        this.mStopped                  = false;
        this.mProcess                  = null;
    }

    Start()
    {
        this.mProcess = LChildProcess.spawn(this.mExecutable, this.mCommandLineParameters,
        {
            detached: true,
            uid: this.mIdentity.user,
            gid: this.mIdentity.group
        });

        const datahandler = function (data)
        {
            LFileSystem.appendFile(this.mLogFile, data, function (error) { });
        };

        this.mProcess.stdout.once("data", datahandler);
        this.mProcess.stderr.once("data", datahandler);

        this.mProcess.once("close", this.OnTerminated);
    }

    CheckPorts()
    {
        if (this.mStopped == true) return;

        var porttestprocess = LChildProcess.exec("netstat -apn | grep '" + this.mProcess.pid + "/'", function (error, stdout, stderr)
        {
            if (error)
            {
                this.mStopped = true;

                LFileSystem.appendFile(this.mLogFile, "\n[oxidane internal log] An error occurred while testing server's used ports - exiting\n", function (error) { });
                process.kill(-this.mProcess.pid); //we'll let it get away with a graceful SIGTERM - it wasn't its fault anyways

                return;
            }

            var lines = stdout.split("\n");

            for (var line in lines)
            {
                var port = parseInt(lines[line].substring(20, 44).split(" ")[0].split(":")[1]);

                if (this.mPorts.indexOf(port) == -1)
                {
                    this.mStopped = true;
                    
                    LFileSystem.appendFile(this.mLogFile, "\n[oxidane internal log] Server listening on unauthorized port " + port + " - exiting\n", function (error) { });
                    process.kill(-this.mProcess.pid, "SIGKILL");

                    return;
                }
            }
        });
    }

    Terminate()
    {
        this.mStopped = true;

        process.kill(-this.mProcess.pid);
    }

    OnTerminated(code)
    {
        if (this.mStopped == true) return;

        LFileSystem.appendFile(this.mLogFile, "\n[oxidane internal log] Process terminated (exit code " + code + ") - restarting\n", function (error) { });
        Start();
    }
}

module.exports =
{
    GameServer: GameServer
}
