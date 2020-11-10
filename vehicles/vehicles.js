const { createClient, vehicleModels } = require("oakwood");

const oak = createClient();

const loadVehs = () => knex("vehicles");
vehicles = new Map();

oak.event("vehicleUse", async (veh, pid) => {
  //Check if not bought
  let currVeh = vehiclesShop.get(veh)
  if (currVeh != undefined) {
    oak.hudAnnounce(pid, `You can buy this vehicle for $${currVeh.price} (/buy)`, 10);
    setTimeout(getOut, 3000, pid, veh);
  }
  lastveh = veh;
});

oak.event("start", async () => {
  let currentVehicle = await loadVehs();
  let vehicleArray = [];
  for (i = 0; i < currentVehicle.length; i++) {
    let m = parseInt(currentVehicle[i].model);
    vehicleArray[i] = await oak.vehicleSpawn(
      vehicleModels[m][1],
      JSON.parse(currentVehicle[i].pos),
      currentVehicle[i].heading
    );
    vehicles.set(vehicleArray[i], {
      owner: currentVehicle[i].owner,
      plate: currentVehicle[i].plate,
      model: currentVehicle[i].model,
    });
    console.log(
      `Spawned ${vehicleModels[m][0]} on pos ${currentVehicle[i].pos}`
    );
  }
});

const spawncar = async (pid, model, adjustPos) => {
  const m = parseInt(model);

  if (m === NaN) {
    return oak.chatSend(
      pid,
      `[error] provided argument should be a valid number`
    );
  }

  oak.chatSend(
    pid,
    `[info] spawning persistent vehicle: ${vehicleModels[m][0]}`
  );
  let posdb;
  let headdb;
  let pos = await oak.playerPositionGet(pid);
  let heading = await oak.playerHeadingGet(pid);

  if (adjustPos === true) {
    let dir = await oak.playerDirectionGet(pid);
    pos = pos.map((p, i) => p + dir[i] * 1.5);
    heading -= 90.0;
    posdb = pos;
    headdb = heading;
  }

  const veh = await oak.vehicleSpawn(vehicleModels[m][1], pos, heading);
  return veh;
};

doesPlateExists = async (plate) => {
  let rv = false;
  await vehicles.forEach((element) => {
    if (element.plate == plate) {
      rv = true;
    }
  });
  return rv;
};

oak.cmd("vehpos", async (pid) => {
  const veh = await oak.vehiclePlayerInside(pid);
  console.log(`POS: ${await oak.vehiclePositionGet(veh)}`);
  console.log(`HEADING: ${await oak.vehicleHeadingGet(veh)}`);
});

oak.cmd("park", async (pid) => {
  const veh = await oak.vehiclePlayerInside(pid);
  const plate = vehicles.get(veh).plate;
  const pos = await oak.vehiclePositionGet(veh);
  const heading = await oak.vehicleHeadingGet(veh);
  db: vehicle: updatePos(plate, pos, heading);
  oak.chatSend(pid, "You've parked your vehicle");
});

oak.cmd("car", async (pid, model) => {
  spawncar(pid, model, true);
});
