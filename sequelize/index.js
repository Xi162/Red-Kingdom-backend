require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  username: "root",
  password: process.env.MYSQL_PASSWORD,
  dialect: "mysql",
  database: "shop_red_kingdom",
});

//define all models
async function initializeSequelize() {
  try {
    require("./models/User.model")(sequelize);
    require("./models/Product.model")(sequelize);
    require("./models/Cart.model")(sequelize);
    require("./models/Order.model")(sequelize);
    require("./models/Article.model")(sequelize);

    //create relationship between models
    require("./relationships")(sequelize);
    await sequelize.sync({ alter: true });
  } catch (e) {
    console.log(e);
  }
}

// async function test() {
//   const Bar = sequelize.define("Bar", {
//     id: {
//       type: DataTypes.UUID,
//       primaryKey: true,
//       defaultValue: DataTypes.UUIDV4,
//     },
//     name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   });

//   async function main() {
//     await Bar.sync();
//     const bar = await Bar.create({
//       name: "Hello",
//     });

//     const barF = await Bar.count();
//     console.log(barF);
//     await Bar.drop();
//     sequelize.close();
//   }

//   main();
// }

module.exports = { sequelize, initModels: initializeSequelize };
