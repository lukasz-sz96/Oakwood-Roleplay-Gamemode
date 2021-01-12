const { createClient, vehicleModels } = require("oakwood");
const oak = createClient();

oak.cmd("me", async (pid, ...args) => {
  chatMe(pid, args.join(" "), 10);
});

chatMe = async (pid, message, range) => {
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
