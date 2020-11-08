const { createClient, vehicleModels } = require("oakwood");
const { loadVehs } = require("./db.js");

const oak = createClient();

require("./db.js");
const pc = require("./login");


var vehicles = new Map();
let lastveh;
oak.event("vehicleUse", async (veh, pid, success, seatId, enterOrLeave) => {
  console.log(`Auto1 ${veh} ${pid} ${seatId} ${enterOrLeave}`);
  let a = vehicles.get(veh);
  console.log(a);
  if (a.owner == pid) {
  } else {
    oak.hudAnnounce(pid, "You can buy this vehicle for $1760 (/buy)", 10);
    lastveh = veh;
    setTimeout(getOut, 3000, pid, veh);
  }
});



oak.event("start", async () => {
    let a = loadVehs() //your Await hear
    let d = [];
    for (i = 0; i < a.length; i++) {
      var m = parseInt(a[i].model);
      d[i] = await oak.vehicleSpawn(
        vehicleModels[m][1],
        JSON.parse(a[i].pos),
        a[i].heading
      );
      vehicles.set(d[i], { owner: a[i].owner, model: a[i].model });
      console.log(`Spawned ${vehicleModels[m][0]} on pos ${a[i].pos}`);
    }
    console.log(vehicles);
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

oak.cmd("vehpos", async (pid) => {
  const veh = await oak.vehiclePlayerInside(pid);
  console.log(await oak.vehiclePositionGet(veh));
  console.log(await oak.vehicleHeadingGet(veh));
});

oak.cmd("car", async (pid, model) => {
  spawncar(pid, model, true);
});

exports.vehicleList = vehicles;