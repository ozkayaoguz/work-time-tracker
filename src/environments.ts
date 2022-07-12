import * as dotenv from 'dotenv';
import { resolve as pathResolve } from 'path';

(() => {
  const path = pathResolve(__dirname, '..', 'config', `${process.env.NODE_ENV || ''}.env`);

  const env = dotenv.config({
    path,
  });
  if (env.error) throw env.error;
})();
