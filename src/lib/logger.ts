/* eslint-disable no-console */
export const logger = (message: string) => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }
  console.log(message);
};
