import { error, json } from "@sveltejs/kit";
import { calculateState } from "$lib/server/gameLogic.js";
import g from "$lib/data/mockGameState.json";
import { gameLog } from "../../lib/game/helpers";

const GESTURES = ["D", "F", "P", "S", "W", "C"];

let game = g;

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
  let body = await request.json();

  // Check if move is legal

  // Perform server functions
  Object.entries(game.stats).forEach(([name, player]) => {
    if (player.enchantments.some((enchantment) => enchantment.name === "Confusion")) {
      let hand = Math.floor(Math.random() * 2);
      let gesture = GESTURES[Math.floor(Math.random() * GESTURES.length)];
      if (body.gestures[hand] !== gesture) {
        gameLog(`Confused, ${"you"} gestures ${gesture} with their ${["left", "right"][hand]} hand`, game);
        body.gestures[hand] = gesture;
        // TODO: cast a spell or give an option to if changed hand completes a spell?
        body.spells[hand] = null;
      } else {
        gameLog(`${"you"} somehow braves through their confusion`, game);
      }
    }
  });

  // Add moves to game
  game.moves.you = [];
  [0, 1].forEach((i) => {
    if (body.spells[i]) {
      game.moves.you.push({
        selected: body.gestures[i],
        spell: body.spells[i],
        target: body.targets[i],
        caster: "you",
      });
    }
  });
  if (body.gestures[0] === "P" && body.gestures[1] === "P") {
    game.moves.you.push({ spell: "Surrender", caster: "you" });
  }
  game.history.you.push(body.gestures);

  // placeholder enemy
  game.moves.enemy = [];

  // Calculate new game state
  game = calculateState(game);
  game.moves = {};

  return json({
    game,
  });
}
