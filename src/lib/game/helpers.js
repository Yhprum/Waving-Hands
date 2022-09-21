export const kill = (name, state) => {
  state.stats[name].hp = 0;
  if (state.stats[name].type === "wizard") {
    state.stats[name].dead = true;
  } else {
    delete state.stats[name];
  }
  state.chat.push({ sender: "system", message: `${name} has been killed!` });
};

// Note: durations are one turn higher than they actually are, since one tick will happen the turn of casting
export const enchantment = (spell, player, state) => {
  let duration = 0;
  switch (spell) {
    case "Amnesia":
    case "Confusion":
    case "Charm Person":
    case "Charm Monster":
    case "Paralysis":
    case "Fear":
      duration = makePermanent(spell, player, state) ? undefined : 2;
      break;
    case "Anti-Spell":
      duration = 2;
      break;
    case "Resist Heat":
    case "Resist Cold":
      duration = undefined;
      break;
    case "Disease":
    case "Poison":
      duration = 6;
      break;
    case "Protection from Evil":
    case "Blindness":
    case "Invisibility":
    case "Haste":
    case "Delayed Effect":
    case "Permanency":
      duration = makePermanent(spell, player, state) ? undefined : 4;
      break;
    case "Time Stop":
      duration = 2;
      break;
  }
  return { name: spell, duration };
};

const makePermanent = (spell, player, state) => {
  let permanency = player.enchantments.findIndex((enchantment) => enchantment.name === "Permanency");
  if (permanency >= 0) {
    gameLog(`${spell} has been made permanent!`, state);
    player.enchantments.splice(permanency, 1);
    return true;
  }
  return false;
};

export const gameLog = (message, state) => state.chat.push({ sender: "system", message });
