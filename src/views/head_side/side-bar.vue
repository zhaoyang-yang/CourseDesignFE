<template>
  <ul class="bg-black sidebar">
    <li @click="chose">{{ name1 }}</li>
    <li @click="select">{{ name2 }}</li>
  </ul>
</template>

<style scoped>
* {
  color: #f6ca9d !important;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.bg-black {
  background-color: #2a2b30;
}

.sidebar {
  position: relative;
  width: 15vw;
  height: 100vh;
  display: inline-block;
}

li {
  display: flex;
  padding: 10px;
  align-items: center;
  border-radius: 10px;
}

li:hover {
  cursor: pointer;
  background-color: rgb(112, 122, 94);
}
</style>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["name1", "name2"],
  data() {
    return {
      tabPosition: "left",
    };
  },

  setup() {
    //55
  },
  methods: {
    chose() {
      this.$emit("changetab", "chosetab");
    },
    select() {
      this.$emit("changetab", "selecttab");
    },
  },
});
</script>
