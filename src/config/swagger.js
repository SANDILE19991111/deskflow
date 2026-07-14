const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DeskFlow API',
      version: '1.0.0',
      description:
        'Internal IT Service Request Portal — endpoints for authentication and ticket management.',
    },
    servers: [{ url: '/', description: 'Current server' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  // Scan route files for @openapi JSDoc comments
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
