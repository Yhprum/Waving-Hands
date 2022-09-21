<script>
  export let chat;
</script>

<div class="w-full flex flex-col py-1 h-full">
  <div class="overflow-y-scroll h-full px-3">
    {#each chat as message}
      <div>{message.message}</div>
    {/each}
  </div>
  <div class="mt-auto">
    <input placeholder="Send a message" />
  </div>
</div>
