const { createClient, vehicleModels } = require("oakwood");
const dotenv = require("dotenv");
dotenv.config();

const oak = createClient();
require("./core/db.js");
require("./core/groups.js")
require("./core/login.js");
require("./core/economy.js");
require("./vehicles/vehicles.js");
require("./vehicles/vehicleShop.js");
require("./chat/chat.js");
require("./helpers.js")
require("./admin/commands.js")

oak.event("playerConnect", async (pid) => {
  console.log("[info] player connected", pid);

  // oak.playerPositionSet(pid, [-1774.59301758, -4.88487052917, -2.40491962433]);
  // oak.playerHealthSet(pid, 200);
  // oak.playerSpawn(pid, [-1774.59301758, -4.88487052917, -2.40491962433], false);
});

oak.event("stop", () => {
  //TODO save data
});
