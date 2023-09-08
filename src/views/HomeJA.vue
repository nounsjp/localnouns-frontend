<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <div class="flex items-center justify-center space-x-8">
      <!-- <img alt="Vue logo" src="../assets/logo.png" class="logo" /> -->
      <!-- Use Tailwind CSS h-40 (=10rem=160px) instead of .logo. -->
      <!--img alt="Vue logo" src="../assets/logo.png" class="h-40" /-->
    </div>

    <p class="mb-2 font-londrina text-3xl">ご当地ナウンズ</p>
    <!--
    <div class="mb-8 space-y-2 font-pt-root font-medium">
      <p>
        <span class="font-yusei"
          >ナウンズ・アート・フェスティバル (ナウンズフェス) </span
        >は、平和で維持可能な地球の大切さを
        一人でも多くの人に知ってもらうことを目的に、<a
          class="font-londrina underline"
          href="https://nouns.wtf"
          >NounsDAO</a
        >
        のメンバーによって作られた、オンライン・アート・フェスティバルです。
      </p>
      <p>
        最初の<span class="font-yusei">ナウンズフェス</span>は、
        以下のフォーマットで、６ヶ月間に渡る
        <b class="font-font-yusei">オンライン・コンペティション</b
        >の形で開催します。
      </p>
    </div>
    -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "HomeJAPage",
  setup() {
    const store = useStore();
    const total_eth = store.state.total_eth;
    return {
      total_eth,
    };
  },
});
</script>
