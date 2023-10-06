<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-auto bg-smoke-dark flex justify-center items-center"
  >
    <div
      class="relative p-6 bg-white w-3/4 h-3/4 flex flex-col items-center justify-center"
    >
      <TokenDetail :token="token" size="L" />
      <button @click="closeModal">Close</button>
    </div>
  </div>
</template>

<script>
import TokenDetail from "./TokenDetail.vue";
// import { TOKEN } from "@/firestore/token";

export default {
  components: {
    TokenDetail,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    token: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    console.log("token:", props.token);
    const closeModal = () => {
      context.emit("close");
    };
    return {
      closeModal,
    };
  },
};
</script>

<style>
.bg-smoke-dark {
  background-color: rgba(0, 0, 0, 0.85);
}
</style>
