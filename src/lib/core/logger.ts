import log from "loglevel";
import prefix from "loglevel-plugin-prefix";

if (process.env.NODE_ENV == "development") {
  log.setLevel("debug");
}

prefix.reg(log);

prefix.apply(log, {
  format(level, name, timestamp) {
    return `${timestamp} ${level.toUpperCase()} ${name}:`;
  },
});

export default log;
