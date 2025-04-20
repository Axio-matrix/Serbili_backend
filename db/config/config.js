// require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
// module.exports = {
//     development : {
//         username : process.env.DB_USERNAME,
//         password : process.env.DB_PASSWORD,
//         database : process.env.DB_DATABASE,
//         port: process.env.DB_PORT,
//         host: process.env.DB_HOST,
//         dialect: "postgres",
        
//     },
// };

require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

module.exports = {
  development: {
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Important for some cloud providers
      },
    },
    logging: false, // Optional: Disable SQL logs
  },
};
