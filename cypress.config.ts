import { defineConfig } from 'cypress';

export default defineConfig({
  env: {
    grepFilterSpecs: true,
    grepOmitFiltered: true,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // eslint-disable-next-line ts/no-require-imports
      require('@bahmutov/cy-grep/src/plugin')(config);
      // IMPORTANT: return the config object
      return config;
    },
  },
});
