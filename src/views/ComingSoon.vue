<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <div v-if="lang === 'en'">
      <p class="mb-2 font-londrina text-3xl">Coming Soon</p>
      <div class="mb-8 space-y-2 font-pt-root font-medium"></div>
    </div>
    <div v-else>
      <p class="mb-2 font-yusei text-3xl">近日公開</p>
      <div class="mb-8 space-y-2"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "HomePage",
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
