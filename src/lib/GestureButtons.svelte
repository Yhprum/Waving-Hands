<script>
  import spellList from "$lib/data/spellList.json";
  import { isReadySpell, spellTarget } from "$lib/utils";
  export let history;
  export let stats;
  export let you;

  export let gesture;
  export let spell;
  export let target;
  let buttons = ["D", "F", "P", "S", "W", "C", ">", " "];

  $: spellOptions = spellList
    .filter((spell) => isReadySpell(spell.sequence, history, gesture))
    .sort((a, b) => b.sequence.length - a.sequence.length);
  $: {
    if (spellOptions.length && !spellOptions.some((s) => s.name === spell)) spell = spellOptions[0].name;
  }
  $: target = spellTarget[spell];
  $: afraid = stats[you].enchantments.some((enchantment) => enchantment.name === "Fear");

  const hasEnchantment = (search) => stats[you].enchantments.some((enchantment) => enchantment.name === search);
  let buttonClass = { D: "", F: "", P: "", S: "", W: "", C: "", ">": "", " ": "" };
  $: {
    let className;
    Object.keys(buttonClass).forEach((button) => {
      className = "";
      if (gesture === button) className += "selected ";
      if (["C", "D", "F", "S"].includes(button) && hasEnchantment("Fear")) className += "afraid disabled ";
      if (hasEnchantment("Paralysis")) {
        let para = stats[you].enchantments.find((enchantment) => enchantment.name === "Paralysis");
        // TODO: get which hand is paralyzed
        let lastGesture = history.at(-1);
        if (["D", "F", "P", "D", "P", "F", ">", " "][buttons.indexOf(lastGesture)] === button) {
          className += "paralyzed ";
          gesture = button;
        } else {
          className += "disabled ";
        }
      }
      if (hasEnchantment("Charm Person")) className += "charmed "; // TODO: && this hand is charmed

      buttonClass[button] = className;
    });
  }
</script>

<div class="inline-flex btn-matrix mb-2">
  {#each buttons as button}
    <button
      class={buttonClass[button]}
      disabled={buttonClass[button].includes("disabled")}
      on:click={() => (gesture = button)}
    >
      {button}
    </button>
  {/each}
</div>
{#if spellOptions.length}
  <select class="w-full" bind:value={spell} on:change={(e) => (target = spellTarget[e.target.value])}>
    {#each spellOptions as spell}
      <option v-for="spell in spellOptions">{spell.name}</option>
    {/each}
  </select>
  <select class="w-full" bind:value={target}>
    {#each Object.keys(stats) as player}
      <option>{player}</option>
    {/each}
  </select>
{/if}

<style>
  .btn-matrix {
    flex-wrap: wrap;
  }
  .btn-matrix > button {
    width: 25%;
  }
  .btn-matrix > button:nth-child(4n + 5) {
    margin-left: 0;
  }
  .btn-matrix > button:nth-child(n + 5) {
    margin-top: -1px;
  }

  .btn-matrix > button:first-child {
    border-bottom-left-radius: 0;
  }
  .btn-matrix > button:nth-child(4) {
    border-top-right-radius: 4px !important;
  }
  .btn-matrix > button:nth-last-child(4) {
    border-bottom-left-radius: 4px !important;
  }
  .btn-matrix > button:last-child {
    border-top-right-radius: 0;
  }
  .selected {
    background-color: #646cff;
    color: #1a1a1a;
    transition: background-color 0.1s linear;
  }
  button.afraid {
    background-color: darkred;
  }
  button.paralyzed {
    background-color: yellow;
    color: black;
  }
  button.charmed {
    background-color: hotpink;
  }
  button.disabled {
    cursor: not-allowed;
  }
</style>
