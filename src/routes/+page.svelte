<script>
  import GameHistory from "$lib/GameHistory.svelte";
  import GameStats from "$lib/GameStats.svelte";
  import SpellList from "$lib/SpellList.svelte";
  import GestureButtons from "$lib/GestureButtons.svelte";
  import GameChat from "$lib/GameChat.svelte";
  import g from "$lib/data/mockGameState.json";

  let game = g;
  let gestures = [" ", " "];
  let spells = ["", ""];
  let targets = ["", ""];
  const submitMoves = () => {
    console.log("Submit move:", { gestures, spells, targets });
    const options = {
      method: "POST",
      body: JSON.stringify({ gestures, spells, targets }),
      headers: { "Content-Type": "application/json" },
    };
    fetch("/game", options)
      .then((res) => res.json())
      .then((res) => {
        game = res.game;
        gestures = [" ", " "];
        spells = Array(2);
        targets = Array(2);
      });
  };
</script>

<div class="flex h-screen bg-zinc-800">
  <div class="w-full flex flex-col">
    <div class="game-history">
      past moves
      <div class="flex text-center">
        <GameHistory gestures={game.history.you} />
        <GameStats wizard="you" players={game.stats} position="text-left" />
        <GameStats wizard="enemy" players={game.stats} position="text-right" />
        <GameHistory gestures={game.history.enemy} />
      </div>
    </div>
    <div class="game-selection">
      <div class="game-moves flex flex-col">
        <div class="flex">
          <div class="text-center w-1/2  p-3">
            <span>Left Hand</span>
            <GestureButtons
              bind:gesture={gestures[0]}
              bind:spell={spells[0]}
              bind:target={targets[0]}
              history={game.history.you.map((a) => a[0])}
              stats={game.stats}
              you={"you"}
            />
          </div>
          <div class="text-center w-1/2 p-3">
            <span>Right Hand</span>
            <GestureButtons
              bind:gesture={gestures[1]}
              bind:spell={spells[1]}
              bind:target={targets[1]}
              history={game.history.you.map((a) => a[1])}
              stats={game.stats}
              you={"you"}
            />
          </div>
        </div>
        <button class="mt-2 mx-auto rounded" on:click={submitMoves}>Submit Moves</button>
      </div>
      <div class="game-spells px-2">
        <SpellList history={game.history.you} selected={gestures} />
      </div>
    </div>
  </div>
  <div class="history-section">
    <GameChat chat={game.chat} />
  </div>
</div>

<style>
  .history-section {
    width: 500px;
    border-left: 1px solid lightgrey;
  }

  .game-selection {
    display: flex;
    margin-top: auto;
    height: 350px;
    border-top: 1px solid lightgrey;
  }

  .game-moves {
    width: 50%;
  }

  .game-spells {
    width: 50%;
    border-left: 1px solid lightgrey;
  }
</style>
