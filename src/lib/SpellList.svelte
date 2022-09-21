<script>
  import spellList from "$lib/data/spellList.json";
  import Spell from "$lib/Spell.svelte";
  export let history;
  export let selected;
</script>

<div class="spell">
  {#each spellList as spell}
    <div class="flex text-start">
      <Spell {spell} {history} {selected} />
    </div>
  {/each}
</div>

<style>
  .spell {
    font-size: 11px;
    column-width: 200px;
  }
</style>
