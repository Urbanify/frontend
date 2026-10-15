// Use type safe message keys with `next-intl`
type Messages = typeof import('../locales/br.json');

// eslint-disable-next-line
declare interface IntlMessages extends Messages {}
