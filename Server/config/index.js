const fs = require("fs");
const path = require("path");

const LOCAL_CONFIG_FILENAME = process.env.LOCAL_CONFIG_FILENAME || "index.local.json";
const localConfigPath = path.join(__dirname, LOCAL_CONFIG_FILENAME);

let fileConfig = {};

if (fs.existsSync(localConfigPath)) {
  try {
    const raw = fs.readFileSync(localConfigPath, "utf-8");
    fileConfig = JSON.parse(raw);
  } catch (error) {
    console.warn(`Failed to parse local config at ${localConfigPath}:`, error);
  }
}

const getEnv = (key) => {
  const value = process.env[key];
  return value !== undefined ? value : undefined;
};

const getFromConfig = (keys, fallback) => {
  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(fileConfig, key)) {
      return fileConfig[key];
    }
  }

  return fallback;
};

const getNestedFromConfig = (pathArray, fallback) => {
  let current = fileConfig;

  for (const key of pathArray) {
    if (current && Object.prototype.hasOwnProperty.call(current, key)) {
      current = current[key];
    } else {
      return fallback;
    }
  }

  return current;
};

const resolveValue = (envKey, configKeys, fallback) => {
  const envValue = getEnv(envKey);
  if (envValue !== undefined) {
    return envValue;
  }

  if (Array.isArray(configKeys)) {
    return getNestedFromConfig(configKeys, fallback);
  }

  return getFromConfig(configKeys, fallback);
};

module.exports = {
  dbUri: resolveValue("DB_URI", "dbUri", "mongodb://127.0.0.1:27017/vmdb"),
  jwtSecret: resolveValue("JWT_SECRET", "jwtSecret", "change-me"),
  qrSecret: resolveValue("QR_SECRET", "qrSecret", "change-me"),
  email: {
    username: resolveValue("EMAIL_USERNAME", ["email", "username"], ""),
    password: resolveValue("EMAIL_PASSWORD", ["email", "password"], ""),
  },
  customerURL: resolveValue("CUSTOMER_URL", "customerURL", ""),
  gituser: resolveValue("GIT_USER", "gituser", ""),
  gittoken: resolveValue("GIT_TOKEN", "gittoken", ""),
  googleclientid: resolveValue("GOOGLE_CLIENT_ID", "googleclientid", ""),
};

