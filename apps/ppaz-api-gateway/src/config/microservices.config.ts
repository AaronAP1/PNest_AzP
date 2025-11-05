// Configuración centralizada de microservicios
export const MICROSERVICES_CONFIG = {
  CORE: {
    name: 'PPP_CORE_SERVICE',
    host: 'localhost',
    port: 3001,
  },
  COMPANIAS: {
    name: 'PPP_COMPANIAS_SERVICE',
    host: 'localhost',
    port: 3002,
  },
  GATEWAY: {
    port: 3000,
  },
};

export const MESSAGE_PATTERNS = {
  CORE: {
    GET_HELLO: { cmd: 'get_hello_core' },
    GET_DATA: { cmd: 'get_core_data' },
  },
  COMPANIAS: {
    GET_HELLO: { cmd: 'get_hello_companias' },
    GET_ALL: { cmd: 'get_all_companies' },
    GET_BY_ID: { cmd: 'get_company_by_id' },
  },
};
