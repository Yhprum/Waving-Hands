import { spellPriority } from "$lib/utils";
import { hp, summon } from "$lib/game/summons";
import { enchantment, gameLog, kill } from "$lib/game/helpers";
import { STARTING_HP } from "../game/constants";

const badEnchantments = ["Amnesia", "Confusion", "Charm Person", "Charm Monster", "Paralysis", "Fear"];
const nonSpells = ["Stab", "Surrender"];
const nonCounteredSpells = ["Finger of Death", "Dispel Magic", "Counter Spell"];

export function calculateState(state) {
  let moves = Object.values(state.moves).flat();

  // Setup spell states for this turn
  let protections = {};
  let dispelMagic = false;
  Object.entries(state.stats).forEach(([name, player]) => {
    protections[name] = [];
    if (player.enchantments.some((enchantment) => enchantment.name === "Protection from Evil")) {
      protections[name].push("Shield");
      gameLog(`${name} is protected from evil this turn`, state);
    }
  });

  // Cast all Spells in order of priority
  Object.values(moves)
    .sort((a, b) => spellPriority.indexOf(a.spell) - spellPriority.indexOf(b.spell))
    .forEach((move, index) => {
      if (move.spell === "Surrender") {
        state.stats[move.caster].surrender = true;
        gameLog(`${move.caster} holds their hands up in surrender!`, state);
        return;
      }

      gameLog(`${move.caster} casts ${move.spell} at ${move.target}`, state);
      if (dispelMagic && nonSpells.indexOf(move.spell) === -1 && move.spell !== "Dispel Magic") {
        gameLog(`The ${move.spell} was thwarted by Dispel Magic`, state);
        return;
      }
      if (protections[move.target].includes("Counter Spell")) {
        if (nonCounteredSpells.includes(move.spell)) {
          gameLog(`The ${move.spell} was not affected by Counter Spell`, state);
        } else {
          gameLog(`The ${move.spell} was nullified by Counter Spell`, state);
          return;
        }
      }
      if (protections[move.target].includes("Magic Mirror")) {
        if (move.target !== move.caster) gameLog(`The ${move.spell} was reflected back to its caster!`, state);
        move.target = move.caster;
      }

      let element = move.spell.split(" ")[1];
      let opposite = element === "Ice" ? "Fire" : "Ice";
      let resist = element === "Ice" ? "Cold" : "Heat";
      switch (move.spell) {
        // Protection
        case "Counter Spell":
          protections[move.target].push("Shield");
        case "Shield":
        case "Magic Mirror":
          protections[move.target].push(move.spell);
          break;
        case "Dispel Magic":
          dispelMagic = true;
          gameLog("Everyone's enchantments were removed!", state);
          Object.values(state.stats).forEach((player) => {
            player.enchantments = [];
          });
          break;
        case "Cure Light Wounds":
          state.stats[move.target].hp += 1;
          if (state.stats[move.target].hp > STARTING_HP + 1) state.stats[move.target].hp = STARTING_HP + 1;
          break;
        case "Cure Heavy Wounds":
          state.stats[move.target].hp += 2;
          if (state.stats[move.target].hp > STARTING_HP + 1) state.stats[move.target].hp = STARTING_HP + 1;
          let disease = state.stats[move.target].enchantments.findIndex(
            (enchantment) => (enchantment.name = "Disease")
          );
          if (disease >= 0) {
            gameLog(`${move.target}'s Disease was cured!`, state);
            state.stats[move.target].enchantments.splice();
          }
          break;
        case "Remove Enchantment":
          state.stats[move.target].enchantments = [];
          break;

        // Summons
        case "Summon Goblin":
        case "Summon Ogre":
        case "Summon Troll":
        case "Summon Giant":
          summon(move.spell.replace("Summon ", ""), move.target, move.options.summonTarget, state);
          break;
        case "Summon Ice Elemental":
        case "Summon Fire Elemental":
          if (moves.some((move) => move.spell === `Summon ${opposite} Elemental`)) {
            gameLog(`The ${move.spell} was cancelled out`, state);
            break;
          }
          summon(move.spell.replace("Summon ", ""), move.target, move.options.summonTarget, state);
          break;
        // case "Summon Elemental":
        //   state.stats[move.target].summons.push({ type: "Elemental", hp: 2, element: move.element });
        //   break;

        // Damaging
        case "Missile":
          if (protections[move.target].includes("Shield")) {
            gameLog(`The ${move.spell} was shielded`, state);
          } else {
            state.stats[move.target].hp -= 1;
          }
          break;
        case "Finger Of Death":
          kill(move.target, state);
          state.stats[move.target].hp = 0;
          break;
        case "Lightning Bolt":
          state.stats[move.target].hp -= 5;
          // TODO: disable short sequence if used
          break;
        case "Cause Light Wounds":
          state.stats[move.target].hp -= 2;
          break;
        case "Cause Heavy Wounds":
          state.stats[move.target].hp -= 3;
          break;
        case "Fireball":
          if (state.stats[move.target].enchantments.includes("Resist Heat")) {
            gameLog("The fireball was resisted", state);
          } else {
            state.stats[move.target].hp -= 5;
          }
          break;
        case "Fire Storm":
        case "Ice Storm":
          if (moves.some((move) => [`${opposite} Storm`, `Summon ${opposite} Elemental`].includes(move.spell))) {
            gameLog(`The ${move.spell} was cancelled out`, state);
            break;
          }
          if (moves.some((move, index) => move.spell === `${element} Storm` && index > moveIndex)) {
            gameLog(`Two ${move.spell}s act as one`, state);
            break;
          }
          let cancel = false;
          Object.keys(state.status).forEach((player) => {
            if (state.stats[player].type.includes("Elemental")) {
              gameLog(`${player} was destroyed by the ${move.spell}`, state);
              delete state.stats[player];
              if (state.stats[player].type === `${opposite} Elemental`) {
                gameLog(`The ${move.spell} fizzled out after engulfing ${player}`, state);
                cancel = true;
              }
            }
          });
          if (cancel) break;
          Object.keys(state.status).forEach((player) => {
            if (
              state.stats[player].enchantments.includes(`Resist ${resist}`) ||
              protections[player].includes("Counter Spell")
            ) {
              gameLog(`${player} was not affected by the ${move.spell}`, state);
            } else {
              gameLog(`${player} was engulfed by the ${move.spell}`, state);
              state.stats[move.target].hp -= 5;
            }
          });
          break;

        // Enchantments
        case "Amnesia":
        case "Confusion":
        case "Charm Person":
        case "Charm Monster":
        case "Paralysis":
        case "Fear":
          if (moves.some((move, moveIndex) => badEnchantments.includes(move.spell) && index !== moveIndex)) {
            gameLog(`The bad effect of ${move.spell} was cancelled out`, state);
            break;
          }
          state.stats[move.target].enchantments.push(enchantment(move.spell, state.stats[move.caster], state));
          break;
        case "Protection from Evil":
          protections[move.target].push("Shield");
        case "Anti-Spell":
        case "Resist Heat":
        case "Resist Cold":
        case "Disease":
        case "Poison":
        case "Blindness":
        case "Invisibility":
        case "Haste":
        case "Time Stop":
        case "Delayed Effect":
        case "Permanency":
          state.stats[move.target].enchantments.push(enchantment(move.spell, state.stats[move.caster], state));
          break;

        // Non-Spells
        // case "Surrender":
        //   break;
        case "Stab":
          if (protections[move.target].includes("Shield")) {
            gameLog(`The ${move.spell} was shielded`, state);
          } else {
            state.stats[move.target].hp -= 1;
          }
          break;
      }
    });

  // Enchantmants Tick
  Object.entries(state.stats).forEach(([name, player]) => {
    player.enchantments = player.enchantments.filter((enchantment) => {
      if (enchantment.duration) enchantment.duration--;
      if (enchantment.duration === 0) {
        if (enchantment.name === "Disease" || enchantment.name === "Poison") {
          gameLog(`${name} has succumbed to the ${enchantment.name}!`, state);
          kill(name, state);
        } else {
          gameLog(`${name}'s ${enchantment.name} has worn off`, state);
        }
        return false;
      }
      return true;
    });
  });

  // Summons Attack
  Object.entries(state.stats)
    .filter((stat) => stat.type !== "wizard")
    .forEach(([name, summon]) => {
      let damage;
      switch (summon.type) {
        case "Goblin":
        case "Ogre":
        case "Troll":
        case "Giant":
          let target = summon.target;
          damage = hp(summon.type);
          gameLog(`${name} attacks ${target}`, state);
          if (protections[target].includes("Shield")) {
            gameLog(`The attack from ${name} was shielded`, state);
          } else {
            state.stats[target].hp -= damage;
          }
          break;
        case "Ice Elemental":
        case "Fire Elemental":
          damage = hp(summon.type);
          gameLog(`${name} rampages for ${damage} damage to all`, state);
          state.stats[target].hp -= 5;
          break;
      }
    });

  // Things Die
  Object.entries(state.stats).forEach(([name, stat]) => {
    if (stat.dead) return;
    if (stat.hp <= 0 && stat.type === "wizard") {
      stat.hp = 0;
      stat.dead = true;
      gameLog(`${name} has been killed!`, state);
    } else if (stat.type !== "wizard" && (stat.hp <= 0 || dispelMagic)) {
      gameLog(`${name} has been killed!`, state);
      delete state[name];
    }
  });

  // Is the game over?
  let livingWizards = Object.keys(state.stats).filter(
    (name) => state.stats[name].type === "wizard" && state.stats[name].dead === true
  );
  let surrenderedWizards = Object.keys(state.stats).filter(
    (name) => state.stats[name].type === "wizard" && state.stats[name].surrender === true
  );
  if (livingWizards.length - surrenderedWizards.length <= 1) {
    if (livingWizards.length - surrenderedWizards.length === 1) {
      state.winner = livingWizards.find((name) => state.stats[name].surrender === false);
    } else {
      state.draw = true;
    }
  }

  return state;
}
