<script>
  import { goto } from "$app/navigation";
  import { ref, remove, push, set, onValue } from "firebase/database";
  import { database } from "$lib/firebase";

  export let user;
  let challenges = [];
  let opponent;

  const challengeListRef = ref(database, "challenges/" + user);
  onValue(challengeListRef, (snapshot) => {
    const data = snapshot.val();
    challenges = data || {};
  });

  const challenge = () => {
    console.log(opponent);
    const opponentListRef = ref(database, "challenges/" + opponent);
    const challengeRef = push(opponentListRef);
    set(challengeRef, user);
  };
  const accept = (challenger) => {
    const options = {
      method: "POST",
      body: JSON.stringify([user, challenger]),
      headers: { "Content-Type": "application/json" },
    };
    fetch("/play/newGame", options).then((res) => goto);
  };
  const decline = (id) => {
    remove(ref(database, `challenges/${user}/${id}`));
  };
</script>

<div class="w-1/2">
  <div>Challenges</div>
  <div class="mb-2">
    <input bind:value={opponent} class="p-1" placeholder="opponent username" />
    <button on:click={challenge} class="p-1">Challenge</button>
  </div>
  {#each Object.entries(challenges) as [id, challenger]}
    <div class="mb-1">
      From: {challenger}
      <button on:click={accept(challenger)} class="p-1">Accept</button>
      <button on:click={decline(id)} class="p-1">Decline</button>
    </div>
  {/each}
</div>
