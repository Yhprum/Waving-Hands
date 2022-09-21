const names = {
  Goblin: ["Sbeve", "Harold", "Jeff", "Bob", "Larry"],
  Ogre: ["Shrek", "Arnold", "Joe"],
  Troll: ["Greg", "Barno", "Jesse's Fursona"],
  Giant: ["Yrm", "MDao", "Tiny", "Richard (he goes by Dick)"],
  "Fire Elemental": ["Stacy", "Jessica", "Zoe", "Lacy"],
  "Ice Elemental": ["Chad", "Brad", "Dad", "Thad", "Lad", "Gad"],
};

export const summon = (type, controller, target, state) => {
  // TODO: prevent same named summons
  let name = names[type][Math.floor(Math.random() * names[type].length)];
  state[name] = { type, controller, target, hp: hp(type), enchantments: [] };
  state.chat.push({ sender: "system", message: `${name} the ${type} has been summoned` });
};

export const hp = (type) => {
  switch (type) {
    case "Goblin":
      return 1;
    case "Ogre":
      return 2;
    case "Troll":
    case "Fire Elemental":
    case "Ice Elemental":
      return 3;
    case "Giant":
      return 4;
  }
};
