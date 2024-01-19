const { platform } = require("os");
const { execSync } = require("child_process");
const { readFileSync, writeFileSync } = require("fs");

const env = "aat";
const configEnv = process.env.NODE_CONFIG_ENV;
const configFile = `local-${configEnv}`;
if (!env) {
  throw new Error("Environment variable REMOTE_ENV is required");
}

function getSecret(targetEnv, secret) {
  let cmd = `az keyvault secret show --vault-name "rpx-${targetEnv}" -o tsv --query value --name ${secret}`;
  if (platform() == "win32") {
    cmd = `cmd /c ${cmd}`;
  }

  return execSync(cmd).toString().trim();
}

// open a file called skeleton.json and read the contents as a string
const currentDir = __dirname;
const template = readFileSync(`${currentDir}/skeleton.json`).toString();

// replace the env placeholder with the actual env value
const jsonConfig = JSON.parse(template.replace(/\$\{env\}/g, env));

Object.keys(jsonConfig.secrets.rpx).forEach((key) => {
  if (key.includes("redis-connection-string")) {
    jsonConfig.secrets.rpx[key] = getSecret(
      env,
      "webapp-redis6-connection-string"
    );
  } else {
    jsonConfig.secrets.rpx[key] = getSecret(env, key);
  }
});

writeFileSync(`config/${configFile}.json`, JSON.stringify(jsonConfig, null, 4));

console.log(`Secrets for ${env} written to config/${configFile}.json`);