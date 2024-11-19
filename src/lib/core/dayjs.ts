import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

export default dayjs;

export const TIME_FORMAT = 'HH:mm';
export const ADVANCED_DATE_FORMAT = 'Do [of] MMMM YYYY';
