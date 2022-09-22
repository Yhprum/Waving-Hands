<script>
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { goto } from "$app/navigation";
  import { auth } from "$lib/firebase";

  let username = "";
  let password = "";
  let confirm = "";

  let error = null;

  const login = () => {
    if (password !== confirm) {
      error = "Passwords do not match";
    } else {
      error = "";
      createUserWithEmailAndPassword(auth, username + "@yhprum.com", password)
        .then(() => {
          goto("/");
        })
        .catch((e) => {
          switch (e.code) {
            case "auth/invalid-email":
              error = "Invalid username";
              break;
            case "auth/weak-password":
              error = "Password must be at least 6 characters";
              break;
            case "auth/email-already-in-use":
              error = "username not available";
              break;
            default:
              error = "An error occurred";
              console.log(e.code);
              break;
          }
        });
    }
  };
</script>

<div>
  <div class="container mx-auto text-center mt-12">
    <h1 class="font-bold">Waving Hands</h1>
    <div class="flex flex-col">
      Register
      <input bind:value={username} class="m-auto mb-2" type="text" placeholder="username" />
      <input bind:value={password} class="m-auto mb-2" type="password" placeholder="password" />
      <input bind:value={confirm} class="m-auto mb-2" type="password" placeholder="confirm password" />
      Create your first Wizard
      <input class="m-auto mb-2" type="text" placeholder="Wizard name" />
      <button on:click={login} class="m-auto">Enter</button>
      {#if error}
        <span class="text-red-500">{error}</span>
      {/if}
    </div>
  </div>
</div>
