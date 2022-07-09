import * as dotenv from 'dotenv';

(() => {
  const env = dotenv.config({ path: `config/${process.env.NODE_ENV || ''}.env` });
  if (env.error) throw env.error;
})();
