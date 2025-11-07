import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Database
  DATABASE_URL_COMPANIAS: Joi.string().required(),
  
  // Application
  APP_NAME: Joi.string().default('ppp_companias'),
  PORT: Joi.number().default(3002),
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
