<script>
  export let gestures;
</script>

<div class="w-full flex flex-col">
  <div class="flex flex-row">
    <div class="w-1/2">Left</div>
    <div class="w-1/2">Right</div>
  </div>
  {#each gestures.slice(gestures.length - 5) as gesture}
    <div class="flex flex-row p-3">
      <div class="w-1/2">{gesture[0]}</div>
      <div class="w-1/2">{gesture[1]}</div>
    </div>
  {/each}
</div>
