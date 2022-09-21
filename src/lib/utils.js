export const formatSequence = (sequence, history, selected) => {
  if (Array.isArray(sequence)) {
    sequence = [sequence].join(", ");
  }
  for (let i = 0; i <= history.length; i++) {
    let moves = history.slice(i);
    let moveL = moves.map((m) => m[0]).join("");
    let moveR = moves.map((m) => m[1]).join("");
    if (sequence.startsWith(moveL) && sequence !== moveL) {
      if (sequence.startsWith(moveL + selected[0])) {
        sequence = sequence.replace(moveL + selected[0], `${moveL}<u>${selected[0]}</u>`);
      } else if (selected[0] !== undefined) {
        sequence = sequence.replace(moveL, `<s>${moveL}</s>`);
      }
      sequence = sequence.replace(moveL, `<b>${moveL}</b>`);
      break;
    }
    if (sequence.startsWith(moveR) && sequence !== moveR) {
      if (sequence.startsWith(moveR + selected[1])) {
        sequence = sequence.replace(moveR + selected[1], `${moveR}<u>${selected[1]}</u>`);
      }
      sequence = sequence.replace(moveR, `<b>${moveR}</b>`);
      break;
    }
  }
  return sequence;
};

export const isReadySpell = (sequence, history, selected) => {
  if (!Array.isArray(sequence)) {
    sequence = [sequence];
  }
  let moveL = history.map((m) => m[0]).join("");
  let moveR = history.map((m) => m[1]).join("");
  if (
    sequence.some((s) => (moveL + selected[0]).endsWith(s)) ||
    sequence.some((s) => (moveR + selected[1]).endsWith(s))
  ) {
    return true;
  }
  return false;
};

export const spellTarget = {
  "Dispel Magic": "you",
  "Counter Spell": "you",
  "Magic Mirror": "you",
  "Summon Goblin": "you",
  "Summon Ogre": "you",
  "Summon Troll": "you",
  "Summon Giant": "you",
  "Summon Fire Elemental": null,
  "Summon Ice Elemental": null,
  Haste: "you",
  "Time Stop": "you",
  "Protection from Evil": "you",
  "Resist Heat": "you",
  "Resist Cold": "you",
  Paralysis: "enemy",
  Amnesia: "enemy",
  Fear: "enemy",
  Confusion: "enemy",
  "Charm Monster": "you",
  "Charm Person": "enemy",
  Disease: "enemy",
  Poison: "enemy",
  "Cure Light Wounds": "you",
  "Cure Heavy Wounds": "you",
  "Anti-spell": "enemy",
  Blindness: "enemy",
  Invisibility: "you",
  Permanency: "you",
  "Delay Effect": "you",
  "Remove Enchantment": "enemy",
  Shield: "you",
  Missile: "enemy",
  "Cause Light Wounds": "enemy",
  "Cause Heavy Wounds": "enemy",
  "Lightning Bolt": "enemy",
  Fireball: "enemy",
  "Finger of Death": "enemy",
  "Fire Storm": null,
  "Ice Storm": null,
  Stab: "enemy",
};

export const spellPriority = [
  "Dispel Magic",
  "Counter Spell",
  "Magic Mirror",
  "Summon Goblin",
  "Summon Ogre",
  "Summon Troll",
  "Summon Giant",
  "Summon Fire Elemental",
  "Summon Ice Elemental",
  "Haste",
  "Time Stop",
  "Protection from Evil",
  "Resist Heat",
  "Resist Cold",
  "Paralysis",
  "Amnesia",
  "Fear",
  "Confusion",
  "Charm Monster",
  "Charm Person",
  "Disease",
  "Poison",
  "Cure Light Wounds",
  "Cure Heavy Wounds",
  "Anti-spell",
  "Blindness",
  "Invisibility",
  "Permanency",
  "Delay Effect",
  "Remove Enchantment",
  "Shield",
  "Missile",
  "Cause Light Wounds",
  "Cause Heavy Wounds",
  "Lightning Bolt",
  "Fireball",
  "Finger of Death",
  "Fire Storm",
  "Ice Storm",
  "Stab",
  "Surrender",
];
