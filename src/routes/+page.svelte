<script>
  import { signInWithEmailAndPassword, signOut } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { auth } from "$lib/firebase";
  import Challenges from "./Challenges.svelte";

  let user;
  auth.onAuthStateChanged((u) => (user = u));

  let username = "";
  let password = "";
  let error = null;
  const login = () => {
    signInWithEmailAndPassword(auth, username + "@yhprum.com", password)
      .then(() => goto("/"))
      .catch(() => (error = "failed to log in"));
  };
  const logout = () => {
    signOut(auth);
  };
</script>

<div>
  <div class="container mx-auto text-center mt-12">
    <h1 class="font-bold">Waving Hands</h1>
    <div class="flex flex-col">
      {#if user}
        <div>Welcome back, {user.email.split("@")[0]}</div>
        <a class="m-auto mb-5 underline hover:text-blue-500" href="/" on:click={logout}>Logout</a>
        <div class="flex flex-row">
          <Challenges user={user.email.split("@")[0]} />
          <!-- <div class="w-5" /> -->
          <div class="w-1/2">Active Games</div>
        </div>
      {:else}
        Sign in/Sign up
        <input bind:value={username} class="m-auto mb-2" type="text" placeholder="name" />
        <input bind:value={password} class="m-auto mb-2" type="password" placeholder="password" />
        <button on:click={login} class="m-auto">Enter</button>
        <a class="m-auto underline hover:text-blue-500" href="/register">Register</a>
        {#if error}
          <span class="text-red-500">{error}</span>
        {/if}
      {/if}
    </div>
  </div>
</div>
