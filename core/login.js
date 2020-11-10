const { createClient, vehicleModels, playerModels } = require("oakwood");

const oak = createClient();
const bcrypt = require("bcrypt");
const saltRounds = 10;

Players = new Map();

async function loadPlayer(nick, id, pid) {
  let playero;
  await knex("users")
    .where({ name: nick })
    .then((result) => {
      playero = new Player({
        name: nick,
        password: "hash",
        rank: result[0].rank,
        punishment: result[0].punishment,
        id: id,
        pid: pid,
        money: result[0].money,
        bank: result[0].bank,
        job: result[0].job,
        jobRank: result[0].jobRank,
      });
    });

  applyPlayer(playero);
}

async function applyPlayer(player, pid) {
  console.log(`PID: ${await oak.playerNameGet(pid)}`);
  Players.set(await oak.playerNameGet(pid), player);
  console.log(`Saved player data to object: ${JSON.stringify(player)}`);
}

const spawnplayer = async (pid) => {
  const plName = await oak.playerNameGet(pid);
  let loc;
  let model;
  await knex("users")
    .where({ name: plName })
    .then(function (player) {
      loc = JSON.parse(player[0].pos);
      model = playerModels[JSON.parse(player[0].skin)][1];
      oak.playerModelSet(pid, model);
      oak.playerPositionSet(pid, loc);
      oak.playerHealthSet(pid, 200);
      oak.hudFadeout(pid, 1, 500, 0xffffff);
      oak.hudFadeout(pid, 0, 500, 0xffffff);
      oak.playerSpawn(pid, loc, false);
    });

  setInterval(() => {
    savePos(pid);
  }, 60000);
};

async function savePos(pid) {
  const plName = await oak.playerNameGet(pid);
  const pos = await oak.playerPositionGet(pid);

  savePlayerPos(plName, pos);
}

async function savePlayerPos(plName, pos) {
  if (pos[0] != -1 && pos[0] != 0) {
    knex("users")
      .where({ name: plName })
      .update({ pos: JSON.stringify(pos) })
      .then(function (result) {
        console.log(`Saved ${result} Players`);
      });
  }
}

async function findPlayerByLocalId(id) {
  let rv = undefined;
  await Players.forEach((element) => {
    if (Number(element.id) == Number(id)) {
      rv = element;
    }
  });
  return rv;
}

oak.cmd("register", async (pid, pass) => {
  const plName = await oak.playerNameGet(pid);
  register(pid, pass);
});

oak.cmd("login", async (pid, pass) => {
  let plName = await oak.playerNameGet(pid);
  check(plName, pass, pid);
});

const check = (plName, pass, pid) => {
  knex("users")
    .where({ name: plName })
    .then(function (player) {
      if (JSON.stringify(player[0]) == undefined) {
        oak.chatSend(pid, `[info] Account doesn't exist`);
        return;
      }
      bcrypt.compare(pass, player[0].password, function (err, result) {
        if (result) {
          oak.chatSend(pid, `[info] Logged in successfully`);
          spawn(pid);
          loadPlayer(player[0].name, player[0].id, pid);
        } else {
          oak.chatSend(pid, `[info] Wrong password`);
        }
      });
    });
};

const register = async (pid, pass) => {
  const plName = await oak.playerNameGet(pid);
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(pass, salt, async function (err, hash) {
      await knex("users")
        .insert({ name: plName, password: hash })
        .then(function (id, err) {
          if (err) {
            console.log(`Couldn't register player: ${err}`);
          } else {
            console.log(`Registered a new player ${plName}`);
          }
        });
    });
  });
};

const spawn = (pid) => {
  spawnplayer(pid);
};

class Player {
  constructor(data) {
    this.name = data.name;
    this.rank = getRankById(data.rank);
    this.id = data.id;
    this.pid = data.pid;
    this.localnick = data.localnick;
    this.aduty = false;
    this.punishment =
      data.punishment === undefined ? null : JSON.parse(data.punishment);
    this.bw = false;
    this.money = data.money;
    this.bank = data.bank;
    this.job = data.job;
    this.jobRank = data.jobRank;
  }

  can(pid, permissionLevel, checkDuty) {
    if (this.rank[1] < permissionLevel) {
      oak.chatSend(pid, `[info] No permissions`);
      return false;
    }
    if (checkDuty && !this.aduty) {
      oak.chatSend(pid, `[info] You need to be on ADuty`);
      return false;
    }
    return true;
  }

  canAfford(price) {
    if (this.money >= price) {
      return true;
    } else {
      return false;
    }
  }

  addMoney(amount) {
    this.money += amount;
  }

  removeMoney(amount) {
    this.money -= amount;
    console.log(this.money);
  }

  checkJob() {
    return [this.job, this.jobRank];
  }

  getRank() {
    return this.rank;
  }
}
