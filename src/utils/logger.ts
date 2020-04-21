const channelName = process.env.CONSOLERE_CHANNEL_NAME || "TGK-DISCORD-BOT";
const consolere = require("console-remote-client").connect(
  "console.re",
  "80",
  channelName
);
consolere.re.info(`Remote console url: http://console.re/${channelName}`);

interface Logger {
  log: Function;
  info: Function;
  warn: Function;
  error: Function;
  debug: Function;
  clear: Function;
}

const Logger: Logger = {
  log: (param) => consolere.re.log(param),
  info: (param) => consolere.re.info(param),
  warn: (param) => consolere.re.warn(param),
  error: (param) => consolere.re.error(param),
  debug: (param) => consolere.re.debug(param),
  clear: (param) => consolere.re.clear(param),
};

export default Logger;
