const { MYSQL_ADDRESS, MYSQL_USER, MYSQL_PASSWORD, MYSQL_TABLE } = process.env;

knex = require("knex")({
  client: "mysql2",
  connection: {
    host: MYSQL_ADDRESS,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_TABLE,
  },
  debug: false,
  pool: { min: 0, max: 7 },
});

db: vehicle: give = async (model, owner, plate, pos, heading) => {
  await knex("vehicles").insert([
    {
      model: model,
      owner: owner,
      plate: plate,
      pos: JSON.stringify(pos),
      heading: JSON.stringify(heading),
    },
  ]);
};

db: vehicle: updatePos = async (plate, pos, heading) => {
  await knex("vehicles")
    .where({ plate: plate })
    .update({ pos: JSON.stringify(pos), heading: JSON.stringify(heading) });
};
