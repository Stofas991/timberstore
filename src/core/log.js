const PREFIX = '[Timber]';

export const log = {
  error(module, err) {
    console.error(PREFIX, module, err);
  },
  debug(...args) {
    if (window.TimberLoader?.preview) console.debug(PREFIX, ...args);
  },
};
