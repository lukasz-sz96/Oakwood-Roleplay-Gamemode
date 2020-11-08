const { createClient, vehicleModels } = require("oakwood");

const oak = createClient();

const inRange = async (pid, placePos, dist) => {
    playerPos = await oak.playerPositionGet(pid)

    realDistance = Math.sqrt(Math.pow(playerPos[0] - placePos[0], 2) +
    Math.pow(playerPos[1] - placePos[1], 2) +
    Math.pow(playerPos[2] - placePos[2], 2))

    if (realDistance =< dist) {
        return true
    } else {
        return false
    }
};
