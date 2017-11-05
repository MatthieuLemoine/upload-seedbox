import { createLogger, format, transports } from 'winston';
import formatDate from 'date-fns/format';
import chalk from 'chalk';

const { combine, timestamp, printf } = format;

const colors = {
  error: 'red',
  info: 'green',
  debug: 'white',
  log: 'white',
};

const customFormat = printf(info =>
  chalk[colors[info.level.toLowerCase()] || 'white'](`${formatDate(info.timestamp, 'YYYY/MM/DD-HH:mm:ss')} || ${info.level
    .toUpperCase()
    .padEnd(5)} || ${info.message}`));

export default createLogger({
  transports: [new transports.Console()],
  format: combine(timestamp(), customFormat),
});
