<template>
  <div class="mx-auto max-w-lg p-2 text-left">
    <HomeJA v-if="lang === 'ja'" />
    <HomeEn v-else />

    <div class="mx-auto max-w-lg p-2 text-left">
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useI18n } from "vue-i18n";

import HomeJA from "@/views/HomeJA.vue";
import HomeEn from "@/views/HomeEn.vue";

export default defineComponent({
  name: "HomePage",
  components: {
    HomeJA,
    HomeEn,
  },
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
