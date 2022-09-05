#!/usr/bin/env node
const { spawn } = require("child_process");
const fs = require("fs");

let folderName = '.';

if (process.argv.length >= 3) {
  folderName = process.argv[2];
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
}

const handleError = (type, errCode) => {
  console.error(` Error type: ${type}, code: ${errCode}`)
  process.exit(errCode);
}

const logs = (name, process) => {
  process.stdout.setEncoding('utf8');
  process.stdout.on('data', (data) => {
    console.info('\x1b[32m%s\x1b[0m',` ${name} [info]: ${data}`);
  });
  process.stderr.setEncoding('utf8');
  process.stderr.on('data', (data) => {
    console.warn('\x1b[33m%s\x1b[0m', ` ${name} [warn]: ${data}`);
  });
};

const clone = spawn("git", ["clone", "git@github.com:nevermined-io/create-nevermined-react.git", folderName]);

logs('git clone', clone);

clone.on("close", (code) => {
  if (code !== 0) {
    handleError("install", code);
  } else {
    console.info("\x1b[32m%s\x1b[0m", " ☑ Nevermined repository is cloned\n")
    console.info("\x1b[35m%s\x1b[0m", " Installing dependencies... ");

    const install = spawn('npm', ['install'], { cwd: folderName });

    logs('npm install', install);

    install.on("close", (code) => {
      if (code !== 0) {
        handleError("install", code);
      } else {
        console.info("\x1b[32m%s\x1b[0m", " ☑ Installed dependencies\n");
        console.info("\x1b[35m%s\x1b[0m", " Downloading artifacts...");

        const artifacts = spawn('bash', ['./scripts/download-artifacts.sh', 'v2.0.5', 'mumbai'], { cwd: folderName });

        logs('artifacts', artifacts);
  
        artifacts.on("close", (code) => {
          if (code !== 0) {
              handleError("artifacts", code);
          }
          console.info("\x1b[32m%s\x1b[0m", " ☑ Artifacts downloaded\n")
          console.info("\x1b[35m%s\x1b[0m", " Now you can start your dApp with 'npm start' and enjoy!!\n\n");
          console.info(" Don't forget to visit us in our Discord https://discord.com/invite/GZju2qScKq");
          console.info(" Nevermined Team ")
        })
      }
    });
  }
});