const { createClient, vehicleModels } = require("oakwood");
const oak = createClient();
vehiclesToBuy = [];
vehiclesShop = new Map();

const loadShopVehs = () => knex("vehicle_shop");

const positions = [
  (a = [
    [-1531.1265869140625, 14.229043960571289, 513.5451049804688],
    [-49.05943298339844],
  ]),
  (b = [
    [-1532.3541259765625, 14.152090072631836, 508.4287414550781],
    [-49.05943298339844],
  ]),
  (c = [
    [-1533.7003173828125, 14.15056037902832, 503.90771484375],
    [-49.05943298339844],
  ]),
  (d = [
    [-1534.89453125, 14.182486534118652, 499.7138671875],
    [-49.05943298339844],
  ]),
  (e = [
    [-1549.7723388671875, 14.287042617797852, 518.7486572265625],
    [88.19520568847656],
  ]),
  (f = [
    [-1549.6009521484375, 14.290011405944824, 514.3834838867188],
    [88.19520568847656],
  ]),
  (g = [
    [-1549.65185546875, 14.286396026611328, 510.93255615234375],
    [88.19520568847656],
  ]),
  (h = [
    [-1549.5888671875, 14.291535377502441, 507.1728515625],
    [88.19520568847656],
  ]),
  (i = [
    [-1549.8603515625, 14.28553581237793, 503.5140686035156],
    [88.19520568847656],
  ]),
  (j = [
    [-1539.957275390625, 14.18283748626709, 488.0049133300781],
    [-13.714813232421875],
  ]),
  (h = [
    [-1541.4794921875, 14.177946090698242, 484.5583801269531],
    [-13.714813232421875],
  ]),
];
oak.event("start", async () => {
  vehs = [];
  let a = await loadShopVehs();
  a.forEach((element) => {
    vehs.push(element);
  });
  placeVehs();
});

oak.cmd("spawn", async (pid) => {
  placeVehs();
});

// Randomize cars at the dealership every hour
setInterval(() => {
  placeVehs();
}, 60000 * 60);

placeVehs = async () => {
  for (const [key, value] of vehiclesShop.entries()) {
    await oak.vehicleDespawn(key);
  }

  const assignedPlaces = [];
  vehs.forEach(async (el, i) => {
    const rand = Math.floor(Math.random() * positions.length);
    if (!assignedPlaces.includes(rand)) {
      let randomPos = positions[rand];
      assignedPlaces.push(rand);
      let m = parseInt(el.model);
      vehiclesToBuy[i] = await oak.vehicleSpawn(
        vehicleModels[m][1],
        randomPos[0],
        randomPos[1][0]
      );
      vehiclesShop.set(vehiclesToBuy[i], {
        owner: "DEALERSHIP",
        model: vehicleModels[m][0],
        modelID: parseInt(el.model),
        price: el.price,
      });
    }
  });
}

oak.cmd("buy", async (pid) => {
  const player = await Players.get(await oak.playerNameGet(pid));
  let car = vehiclesShop.get(lastveh);
  if (player.canAfford(car.price)) {
    oak.chatSend(pid, `[$] You've paid ${car.price}`);
    oak.chatSend(pid, car.model + " now belongs to you!");
    let plate = await generatePlate();
    vehiclesShop.delete(lastveh);
    vehicles.set(lastveh, {
      owner: player.id,
      plate: plate,
      model: car.modelID,
    });
    db: vehicle: give(
      car.modelID,
      player.id,
      plate,
      await oak.vehiclePositionGet(lastveh),
      await oak.vehicleHeadingGet(lastveh)
    );
    player.removeMoney(car.price);
    console.log(`PRICE: ${car.price}`);
  } else {
    oak.chatSend(pid, `[$] You can't afford this vehicle`);
  }
});
getOut = async (pid, veh) => {
  await oak.vehiclePlayerRemove(veh, pid);
};
