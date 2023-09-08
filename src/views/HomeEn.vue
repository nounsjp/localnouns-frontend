<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <div class="flex items-center justify-center space-x-8">
      <!-- <img alt="Vue logo" src="../assets/logo.png" class="logo" /> -->
      <!-- Use Tailwind CSS h-40 (=10rem=160px) instead of .logo. -->
      <!--img alt="Vue logo" src="../assets/logo.png" class="h-40" /-->
    </div>

    <p class="mb-2 font-londrina text-3xl">Local Nouns(Japan)</p>
    <!--
    <div class="mb-8 space-y-2 font-pt-root font-medium">
      <p>
        <span class="font-londrina">Nouns Art Festival (NounsFes)</span> is an
        online art festival with a purpose to promote a peaceful and sustainable
        world, founded by members of
        <a class="font-londrina underline" href="https://nouns.wtf">NounsDAO</a
        >.
      </p>
      <p>
        We run the very first NounsFes in the form of
        <b class="font-londrina">an online art competition</b>, for the duration
        of six months in the following format.
      </p>
    </div>
    -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "HomePage",
  setup() {
    const store = useStore();
    const total_eth = store.state.total_eth;
    return {
      total_eth,
    };
  },
});
</script>
