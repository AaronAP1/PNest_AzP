import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Application
  APP_NAME: Joi.string().default('ppaz_api_gateway'),
  PORT: Joi.number().default(3000),
  HOST: Joi.string().default('localhost'),
  
  // Microservices
  PPP_AUTH_HOST: Joi.string().default('localhost'),
  PPP_AUTH_PORT: Joi.number().default(3001),
  PPP_CORE_HOST: Joi.string().default('localhost'),
  PPP_CORE_PORT: Joi.number().default(3002),
  PPP_COMPANIAS_HOST: Joi.string().default('localhost'),
  PPP_COMPANIAS_PORT: Joi.number().default(3003),
  PPP_EVALUACIONES_HOST: Joi.string().default('localhost'),
  PPP_EVALUACIONES_PORT: Joi.number().default(3004),
  
  // Database (for health checks)
  DATABASE_URL_CORE: Joi.string().required(),
  DATABASE_URL_COMPANIAS: Joi.string().required(),
  
  // Environment
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  
  // Swagger
  SWAGGER_TITLE: Joi.string().default('PPP API Gateway'),
  SWAGGER_DESCRIPTION: Joi.string().default('API Gateway para el sistema de Prácticas Pre-Profesionales'),
  SWAGGER_VERSION: Joi.string().default('1.0'),
  SWAGGER_PATH: Joi.string().default('api/docs'),
  
  // Security
  RATE_LIMIT_TTL: Joi.number().default(60),
  RATE_LIMIT_MAX: Joi.number().default(100),
  
  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug', 'verbose')
    .default('info'),
});
