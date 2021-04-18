const config = {
    HOST: process.env.DB_HOST || 'sql11.freemysqlhosting.net',
    USER: process.env.DB_USER || 'sql11405175',
    PASSWORD: process.env.DB_PASSWORD || '9296dLTqBi',
    DB: process.env.DB_NAME || 'sql11405175',

    dialect: 'mysql',

    pool: {
         max: 5, //maximum number of connections in pool
         min: 0, //minimum number of connections in pool
         acquire: 30000,//maximum time (ms), that pool will try to get connection before throwing error
         idle: 10000 //maximum time (ms) that a connection can be idle before being released
    },
    define: {
        timestamps: true,
        underscored: true
    }
};

module.exports = config;