const { createClient } = require("oakwood");


const oak = createClient();
const addMoney = async (target, amount) => {
  const player = Players.get(await oak.playerNameGet(target));
  player.addMoney(amount);
};

const removeMoney = async (target, amount) => {
  const player = Players.get(await oak.playerNameGet(target));
  player.removeMoney(amount);
};

oak.cmd("wallet", async (pid) => {
  const player = Players.get(await oak.playerNameGet(pid));
    oak.chatSend(pid, `[wallet] You've got $${player.money} on you`);
});

oak.cmd("addmoney", async (pid, target, amount) => {
  const player = Players.get(await oak.playerNameGet(pid));
  if (player.can(pid, 100, true)) {
    addMoney(target, amount);
    oak.chatSend(pid, `[success] Added $${amount}`);
  }
});

oak.cmd("removemoney", async (pid, target, amount) => {
  const player = Players.get(await oak.playerNameGet(pid));
  if (player.can(pid, 100, true)) {
    removeMoney(target, amount);
    oak.chatSend(pid, `[success] Removed $${amount}`);
  }
});
