<script>
  import { formatSequence, isReadySpell } from "$lib/utils";
  export let spell;
  export let history;
  export let selected;
</script>

<div>{@html formatSequence(spell.sequence, history, selected)}</div>
<div class:text-red-500={isReadySpell(spell.sequence, history, selected)} class="ml-auto">
  {spell.name}
</div>

<style>
  /* .spell {
    font-size: 11px;
    column-width: 200px;
  } */
</style>
