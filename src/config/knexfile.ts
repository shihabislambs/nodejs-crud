module.exports = {
    development: {
      client: 'mysql',
      connection: {
        host : process.env.DB_HOST || 'localhost',
        user : process.env.DB_USER || 'root',
        password : process.env.DB_PWD || '1234',
        database : process.env.DB_NAME || 'nodecrud'
      },
      pool: {
        min: 0,
        max: 10
      },
      migrations: {
        directory: '../../migrations',
        tableName: 'migrations'
      }
    },

    production: {
      client: 'mysql',
      connection: {
        host : process.env.DB_HOST || 'localhost',
        user : process.env.DB_USER || 'root',
        password : process.env.DB_PWD || '1234',
        database : process.env.DB_NAME || 'nodecrud'
      },
      pool: {
        min: 0,
        max: 10
      },
      migrations: {
        directory: '../../migrations',
        tableName: 'migrations'
      }
    }
};
