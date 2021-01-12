const isPoliceman = async (pid) =>
  getPlayerData(pid).checkJob() === "lhpd" ? true : false;

oak.cmd("duty", (pid, pass) => {
  if (isPoliceman(pid)) {
    //todo
  }
});

oak.cmd("ticket", async (pid, target, amount) => {
  if (isPoliceman(pid)) {
    getPlayerData(target).removeMoney(amount);
  }
});
