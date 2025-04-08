import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(duration);
dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: '%s',
    past: '%s',
    s: 'recently',
    m: '1 minute',
    mm: '%d minutes',
    h: '1 hour',
    hh: '%d hours',
    d: 'yesterday',
    dd: (value: string) => {
      const now = dayjs();
      const difference = now.add(-Number(value), 'day');
      return dayjs(difference).format('MM/DD/YYYY');
    },
    M: (value: string) => `${value} month${Number(value) > 1 ? 's' : ''} ago`,
    MM: (value: string) => {
      const now = dayjs();
      const difference = now.add(-Number(value), 'month');
      return dayjs(difference).format('MM/DD/YYYY');
    },
    y: (value: string) => `${value} year${Number(value) > 1 ? 's' : ''} ago`,
    yy: (value: string) => {
      const now = dayjs();
      const difference = now.add(-Number(value), 'year');
      return dayjs(difference).format('MM/DD/YYYY');
    },
  },
});

export default dayjs;

export const DATE_FORMAT = 'DD/MM/YYYY';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'HH:mm DD/MM/YYYY';
export const ADVANCED_DATE_FORMAT = 'Do [of] MMMM YYYY';
