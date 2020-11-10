const { createClient } = require("oakwood");
const oak = createClient();

oak.cmd("dv", async (pid) => {
  const player = await Players.get(await oak.playerNameGet(pid));
  if (player.can(pid, 100, false)) {
    let data = await oak.vehicleList();
    for (let i = 0; i < data.length; i++) {
      oak.vehicleDespawn(data[i]);
    }
  }
});

oak.cmd("testdata", async (pid) => {
  let player = Players.get(await oak.playerNameGet(pid));
  console.log(await player.getRank());
});

oak.cmd("goto", async (pid, targetid) => {
  const player = Players.get(await oak.playerNameGet(pid));
  if (player.can(pid, 100, false)) {
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
  }
});
