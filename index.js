const { createClient, vehicleModels } = require("oakwood");

const Knex = require("knex");

const oak = createClient();
require("./db.js");
require("./login.js");
require("./economy.js");
require("./vehicles.js");
require("./vehicleShop.js");

oak.event("playerConnect", async (pid) => {
  console.log("[info] player connected", pid);

  oak.playerPositionSet(pid, [-1774.59301758, -4.88487052917, -2.40491962433]);
  oak.playerHealthSet(pid, 200);
  oak.playerSpawn(pid, [-1774.59301758, -4.88487052917, -2.40491962433], false);
});

oak.event("stop", () => {
  //TODO save data
});

oak.cmd("w", async (pid) => {
  let data = await oak.vehicleList();
  console.log(`Dlug: ${data.length}`);
  for (let i = 0; i < data.length; i++) {
    oak.vehicleDespawn(data[i]);
  }
});

oak.cmd("goto", async (pid, targetid) => {
  let a = JSON.stringify(oak.vehicleList());

  const tid = parseInt(targetid);

  if (tid === NaN) {
    return oak.chatSend(
      pid,
      `[error] provided argument should be a valid number`
    );
  }

  if (await oak.playerInvalid(tid)) {
    return oak.chatSend(pid, `[error] player you provided was not found`);
  }

  /* get target position */
  const pos = await oak.playerPositionGet(tid);

  /* set our player position */
  oak.playerPositionSet(pid, pos);
});

oak.cmd("cam", async (pid) => {
  await oak.cameraSet(
    pid,
    [-1626.2490458488464, 0.6776643991470337, -20.89565917849541],
    [90, -5, -60]
  );
});

oak.cmd("me", async (pid, ...args) => {
  chatMe(pid, args.join(" "), 10);
});

async function chatMe(pid, message, range) {
  let receivers = await getNearbyPlayers(pid, range);
  let author = await oak.playerNameGet(pid);

  if (receivers == undefined) {
    oak.chatSend(pid, `${author} ${message}`);
    return;
  }
  receivers.forEach((value) => {
    oak.chatSend(value, `${author} ${message}`);
  });
}

async function getNearbyPlayers(pid, range) {
  let inRange = [];
  let playerList = await oak.playerList();

  for (let i = 0; i < playerList.length; i++) {
    // if (playerList[i] == pid) return;
    if (
      (await distance(
        await oak.playerPositionGet(pid),
        await oak.playerPositionGet(playerList[i])
      )) > range
    )
      return;
    inRange.push(playerList[i]);
  }
  console.log(`Players in range: ${inRange}`);
  return inRange;
}

async function distance(x, y) {
  return Math.sqrt(
    Math.pow(x[0] - y[0], 2) +
      Math.pow(x[1] - y[1], 2) +
      Math.pow(x[2] - y[2], 2)
  );
}
