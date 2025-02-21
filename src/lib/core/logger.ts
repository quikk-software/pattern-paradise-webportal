import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  log.setLevel('debug');
}

prefix.reg(log);

prefix.apply(log, {
  format(level, name, timestamp) {
    return `${timestamp} ${level.toUpperCase()} ${name}:`;
  },
});

export default log;
