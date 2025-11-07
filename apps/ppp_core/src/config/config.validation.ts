import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Database
  DATABASE_URL_CORE: Joi.string().required(),
  
  // Application
  APP_NAME: Joi.string().default('ppp_core'),
  PORT: Joi.number().default(3001),
  HOST: Joi.string().default('localhost'),
  
  // Environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  
  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug', 'verbose')
    .default('info'),
});
