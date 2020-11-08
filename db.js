// const { createClient, vehicleModels } = require("oakwood");
// const oak = createClient();
var knex = require("knex")({
  client: "mysql",
  connection: {
    host: "127.0.0.1",
    user: "sa",
    password: "6232",
    database: "mafia",
  },
  debug: false,
  pool: { min: 0, max: 7 },
});

async function loadVehs() {
  let a;
  await knex("vehicles").then((veh) => {
    console.log(`Selected ${veh.length} vehs`);
    a = veh;
  });
  return a;
}

async function loadShopVehs() {
  let a;
  await knex("vehicle_shop").then((veh) => {
    console.log(`Loaded ${veh.length} shop vehs`)
    a = veh
  });
  return a;
}

const getName = () => {
  return "Jim";
};

exports.getName = getName;
exports.knex = knex;
exports.loadVehs = loadVehs;
exports.loadShopVehs = loadShopVehs;
