<template>
  <div class="mx-auto p-2 text-center font-londrina font-yusei">
    <img src="/banner.jpeg" class="mb-8 mt-8 w-full" />
    <div v-if="lang === 'en'">
      <div class="text-3xl">
        <p>Someone else's miss</p>
        <p>become</p>
        <p>Someone else's hit</p>
      </div>
      <img
        class="h-3 w-8 animate-spin mx-auto mt-8 mb-8"
        src="@/assets/red160px.png"
      />
      <div class="mt-8 mb-8 text-8xl">
        <p>Local Nouns</p>
      </div>
      <img
        class="h-3 w-8 animate-spin mx-auto mt-8 mb-8"
        src="@/assets/red160px.png"
      />
      <div class="mt-8 mb-16 text-3xl">
        <p>Love for the local community</p>
        <p>Exchangeable</p>
        <p>Unique Marketplace</p>
      </div>
      <div class="mt-8 mb-8 text-3xl underline">
        <router-link :to="localizedUrl('/mint')"> >>> Go to Mint</router-link>
      </div>
      <div class="mt-8 mb-8 text-3xl underline">
        <router-link :to="localizedUrl('/list/0')">
          >>> Go to Sale,Trade</router-link
        >
      </div>
    </div>
    <div v-else>
      <div class="text-3xl">
        <p>誰かのハズレが</p>
        <p>誰かの当たり</p>
      </div>
      <img
        class="h-3 w-8 animate-spin mx-auto mt-8 mb-8"
        src="@/assets/red160px.png"
      />
      <div class="mt-8 mb-8 text-8xl">
        <p>ご当地Nouns</p>
      </div>
      <img
        class="h-3 w-8 animate-spin mx-auto mt-8 mb-8"
        src="@/assets/red160px.png"
      />
      <div class="mt-8 mb-16 text-3xl">
        <p>郷土愛・交換可能・独自マケプレ</p>
      </div>
      <div class="mt-8 mb-8 text-3xl underline">
        <router-link :to="localizedUrl('/mint')">
          >>> ミントページはこちら</router-link
        >
      </div>
      <div class="mt-8 mb-8 text-3xl underline">
        <router-link :to="localizedUrl('/list/0')">
          >>> 購入・交換はこちら</router-link
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "Top",
  setup() {
    const i18n = useI18n();

    const lang = computed(() => {
      return i18n.locale.value;
    });

    return {
      lang,
    };
  },
});
</script>
