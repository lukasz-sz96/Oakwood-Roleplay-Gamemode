const ranks = new Map();

ranks.set(0, ["Player", 10, ""]);
ranks.set(1, ["VIP", 20, ""]);
ranks.set(2, ["Trial Support", 30, ""]);
ranks.set(3, ["Support", 40, ""]);
ranks.set(4, ["Support II", 50, ""]);
ranks.set(5, ["Support III", 60, ""]);
ranks.set(6, ["Supervisor", 70, ""]);
ranks.set(7, ["Developer", 80, ""]);
ranks.set(8, ["Administrator", 90]);
ranks.set(9, ["Owner", 100]);

function getRankById(id) {
    return ranks.get(id);
}
