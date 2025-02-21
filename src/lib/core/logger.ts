import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

if (process.env.VERCEL_ENV === 'development' || process.env.VERCEL_ENV === 'staging') {
  log.setLevel('debug');
}

prefix.reg(log);

prefix.apply(log, {
  format(level, name, timestamp) {
    return `${timestamp} ${level.toUpperCase()} ${name}:`;
  },
});

export default log;
