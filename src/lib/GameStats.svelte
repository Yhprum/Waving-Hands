<script>
  export let position;
  export let players;
  export let wizard;
  $: stats = players[wizard];

  const formatEnchantment = (enchantment) => {
    let text = enchantment.name;
    if (enchantment.duration !== 1) {
      text += ": ";
      text += enchantment.duration === undefined ? "∞" : enchantment.duration + " turns";
    }
    return text;
  };
</script>

<div class={`w-full ${position}`}>
  <div class="font-bold underline">Stats</div>
  <div>hp: {stats.hp}</div>
  <div class="font-bold underline">Enchantments</div>
  {#each stats.enchantments as enchantment}
    <div>{formatEnchantment(enchantment)}</div>
  {/each}
  <div class="font-bold underline">Summons</div>
  {#each Object.entries(players).filter(([name, stats]) => stats.controller === wizard) as [name, summon]}
    <div>{name} ({summon.type}): {summon.hp} hp</div>
  {/each}
</div>
