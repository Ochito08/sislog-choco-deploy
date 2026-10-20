const swaggerJsdoc = require('swagger-jsdoc')

const options = {
  definition: {
    openapi: '3.0.3',

    info: {
      title: 'SISLOG-CHOCÓ API',
      version: '3.0.0',
      description:
        'API REST del Sistema de Gestión Logística de Ayudas Humanitarias en el Chocó.'
    },

    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local de desarrollo'
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },

      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Mensaje de error.'
            }
          }
        }
      }
    },

    tags: [
      {
        name: 'Sistema',
        description: 'Estado general de la API'
      },
      {
        name: 'Autenticación',
        description: 'Inicio de sesión y usuario autenticado'
      },
      {
        name: 'Entregas',
        description: 'Gestión y seguimiento de entregas'
      },
      {
        name: 'Usuarios',
        description: 'Gestión de usuarios del sistema'
      }
    ]
  },

  apis: [
    './src/app.js',
    './src/routes/*.js'
  ]
}

module.exports = swaggerJsdoc(options)