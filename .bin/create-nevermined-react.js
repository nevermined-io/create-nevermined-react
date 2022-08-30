#!/usr/bin/env node
const { spawn } = require("child_process");
const fs   = require("fs");

let folderName = '.';

if (process.argv.length >= 3) {
  folderName = process.argv[2];
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
}

const clone = spawn("git", ["clone", "git@github.com:nevermined-io/create-nevermined-react.git", folderName]);

clone.on("close", (code) => {
  if (code !== 0) {
    handleError("install", code);
  } else {
    console.log(" Nevermined repository is cloned. Installing dependencies... ");

    const install = spawn('npm', ['install'], { cwd: folderName });

    install.on("close", (code) => {
      if (code !== 0) {
        handleError("install", code);
      } else {
        console.log(" Installed dependencies ✅ ");
        console.log(" Downloading artifacts... ");

        const artifacts = spawn('npm', ['run', 'artifacts:download'], { cwd: folderName });
  
        artifacts.on("close", (code) => {
          if (code !== 0) {
              handleError("artifacts", code);
          }
          console.log(" Artifacts downloaded ")
          console.log(" Now you can start your dApp with 'npm start' and enjoy!! ");
          console.log(" Don't forget to visit us in our Discord https://discord.com/invite/GZju2qScKq ");
          console.log(" Nevermined Team ")
        })
      }
    });
  }
});

function handleError(type, errCode) {
    console.error()
    process.exit(errCode);
}