import moment from 'moment';

export default function(value) {
  return moment(String(value)).fromNow();
}
