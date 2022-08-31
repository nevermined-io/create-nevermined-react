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
  console.error(`Error type: ${type}, code: ${errCode}`)
  process.exit(errCode);
}

const logs = (name, process) => {
  process.stdout.setEncoding('utf8');
  process.stdout.on('data', (data) => {
    console.info(`${name}: ${data}`);
  });
  process.stderr.setEncoding('utf8');
  process.stderr.on('data', (data) => {
    console.warn(`${name}: ${data}`);
  });
};

const clone = spawn("git", ["clone", "git@github.com:nevermined-io/create-nevermined-react.git", folderName]);

logs('git clone', clone);

clone.on("close", (code) => {
  if (code !== 0) {
    handleError("install", code);
  } else {
    console.info(" Nevermined repository is cloned. Installing dependencies... ");

    const install = spawn('npm', ['install'], { cwd: folderName });

    logs('install', install);

    install.on("close", (code) => {
      if (code !== 0) {
        handleError("install", code);
      } else {
        console.info(" Installed dependencies ✅ ");
        console.info(" Downloading artifacts... ");

        const artifacts = spawn('sh', ['./scripts/download-artifacts.sh', 'v2.0.5', 'mumbai'], { cwd: folderName });

        logs('artifacts', artifacts);
  
        artifacts.on("close", (code) => {
          if (code !== 0) {
              handleError("artifacts", code);
          }
          console.info(" Artifacts downloaded ")
          console.info(" Now you can start your dApp with 'npm start' and enjoy!! ");
          console.info(" Don't forget to visit us in our Discord https://discord.com/invite/GZju2qScKq ");
          console.info(" Nevermined Team ")
        })
      }
    });
  }
});