const getJobRank = async (pid) => Players.get(await oak.playerNameGet(pid)).checkJob()