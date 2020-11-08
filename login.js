const { createClient, vehicleModels, playerModels } = require("oakwood");

const oak = createClient();
const players = new Map();

oak.cmd("w", async (pid) => {
  console.log(players);
});

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
  players.set(await oak.playerNameGet(pid), player);
  console.log(`Saved player data to object: ${JSON.stringify(player)}`);
}

const spawnplayer = async (pid) => {
  var plName = await oak.playerNameGet(pid);
  var loc;
  await knex("users")
    .where({ name: plName })
    .then(function (player) {
      loc = JSON.parse(player[0].pos);
    });
  const rndarr = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const model = rndarr(playerModels);

  oak.playerModelSet(pid, model[1]);
  oak.playerPositionSet(pid, loc);
  oak.playerHealthSet(pid, 200);
  oak.hudFadeout(pid, 1, 500, 0xffffff);
  oak.hudFadeout(pid, 0, 500, 0xffffff);
  oak.playerSpawn(pid, loc, false);

  setInterval(function () {
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
        console.log(`Saved ${result} players`);
      });
  }
}

async function findPlayerByLocalId(id) {
  let rv = undefined;
  await players.forEach((element) => {
    if (Number(element.id) == Number(id)) {
      rv = element;
    }
  });
  return rv;
}

oak.cmd("register", async (pid, pass) => {
  var plName = await oak.playerNameGet(pid);

  knex("users")
    .where({ name: plName })
    .then(function (err) {
      if (err) {
        console.log(`Błąd zapisania postaci: ${err}`);
      } else {
        spawn(pid);
        console.log("Zapisano nową postać");
      }
    });
});

oak.cmd("login", async (pid, pass) => {
  let plName = await oak.playerNameGet(pid);
  check(plName, pass, pid);
});

const check = (plName, pass, pid) => {
  console.log(plName);
  console.log(pass);

  knex("users")
    .where({ name: plName })
    .then(function (player) {
      // console.log(player[0])
      if (JSON.stringify(player[0]) == undefined) {
        oak.chatSend(pid, `[info] Account doesn't exist`);
        console.log("nie znaleziono usera");
      }
      console.log(player[0].password);
      if (player[0].password == pass) {
        oak.chatSend(pid, `[info] Logged in successfully`);
        spawn(pid);
        loadPlayer(player[0].name, player[0].id, pid);
      }
    });
};

oak.cmd("testdata", async (pid) => {
  let player = players.get(await oak.playerNameGet(pid));
  console.log(await player.getRank());
});

const register = (pid, pass) => {
  var plName = oak.playerNameGet(pid);

  knex("users")
    .insert({ name: plName, password: pass })
    .then(function (err) {
      if (err) {
        console.log(`Błąd rejestracji: ${err}`);
      } else {
        console.log(`Pomyślnie zarejestrowano gracza ${plName}`);
      }
    });
};

var ranks = new Map();

ranks.set(0, ["Gracz", 10, ""]);
ranks.set(1, ["Premium", 20, ""]);
ranks.set(2, ["Trial Support", 30, "~p~(Trial)~p~"]);
ranks.set(3, ["Support", 40, "~f~(Support)~f~"]);
ranks.set(4, ["Support II", 50, "~f(Support)~f~"]);
ranks.set(5, ["Support III", 60, "~f(Support)~f~"]);
ranks.set(6, ["Opiekun", 70, "~y~(Opiekun)~y"]);
ranks.set(7, ["Supervisor", 80, "~d~(Supervisor)~d~"]);
ranks.set(8, ["Developer", 90, "~o~(Developer)~o~"]);
ranks.set(9, ["Administrator", 100]);

const spawn = (pid) => {
  spawnplayer(pid);
};
function getRankById(id) {
  return ranks.get(id);
}

class Player {
  constructor(data) {
    this.name = data.name;
    this.rank = getRankById(data.rank);
    this.id = data.id;
    this.pid = data.pid;
    this.localnick = data.localnick;
    this.aduty = true;
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
    this.money = +amount;
  }

  removeMoney(amount) {
    this.money - +amount;
  }

  checkJob() {
    return [this.job, this.jobRank];
  }

  getRank() {
    return this.rank;
  }
}
