const { createClient } = require("oakwood");
const { playerList } = require("./login");

const oak = createClient();
const addMoney = async (pid, amount) => {
  const player = playerList.get(await oak.playerNameGet(pid));
  player.addMoney(amount);
};

const removeMoney = async (pid, amount) => {
  const player = playerList.get(await oak.playerNameGet(pid));
  player.removeMoney(amount);
};

oak.cmd("wallet", async (pid) => {
  const player = playerList.get(await oak.playerNameGet(pid));
    oak.chatSend(pid, `[wallet] You've got $${player.money} on you`);
});

oak.cmd("addmoney", async (pid, amount) => {
  const player = playerList.get(await oak.playerNameGet(pid));
  if (player.can(pid, 100, true)) {
    addMoney(pid, amount);
    oak.chatSend(pid, `[success] Added $${amount}`);
  }
});

oak.cmd("removemoney", async (pid, amount) => {
  const player = playerList.get(await oak.playerNameGet(pid));
  if (player.can(pid, 10, true)) {
    removeMoney(pid, amount);
    oak.chatSend(pid, `[success] Removed $${amount}`);
  }
});
