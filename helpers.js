const { createClient, vehicleModels } = require("oakwood");

const oak = createClient();

inRange = async (pid, placePos, dist) => {
  playerPos = await oak.playerPositionGet(pid);

  realDistance = Math.sqrt(
    Math.pow(playerPos[0] - placePos[0], 2) +
      Math.pow(playerPos[1] - placePos[1], 2) +
      Math.pow(playerPos[2] - placePos[2], 2)
  );

  if (realDistance <= dist) {
    return true;
  } else {
    return false;
  }
};

distance = async (x, y) => {
  return Math.sqrt(
    Math.pow(x[0] - y[0], 2) +
      Math.pow(x[1] - y[1], 2) +
      Math.pow(x[2] - y[2], 2)
  );
};

getNearbyPlayers = async (pid, range) => {
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
};

generatePlate = async () => {
  let result = "ABC123";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const charactersLength = characters.length;
  const numbersLength = numbers.length;
  while (await doesPlateExists(result)) {
    result = "";
    for (let i = 0; i < 3; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    for (let i = 0; i < 3; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbersLength));
    }
    console.log(`Plate assigned: ${result}`);
  }

  return result;
};

