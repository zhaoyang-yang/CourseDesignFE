<template>
  <div class="headerBar">
    <div class="header-left">
      <div class="app-name">
        <div>{{ store.state.user.name }}你好</div>
      </div>
      <div class="breadcrum">
        <div @click="toHome()" class="app-name-home">
          <img
            :src="require('@/assets/icon-home-golden.png')"
            alt="图标"
            width="18px"
            height="18px"
          />
          <div>首页</div>
        </div>
      </div>
    </div>

    <div class="header-right">
      <fullscreen v-model="isFullscreen" class="fullscreen"></fullscreen>
      <img
        class="user-center-img"
        :src="require('@/assets/logo.png')"
        width="30px"
        height="30px"
        alt="图片"
      />
      <div ref="headerSelect" @click.stop="clickSelect()">
        <img
          class="select-img"
          :src="require('@/assets/icon-select.png')"
          width="24px"
          height="24px"
          alt="图片"
        />
        <div v-show="showSelect" class="select-panel">
          <div>用户：{{ store.state.user.name }}</div>
          <router-link @click.stop="logout()" to="/" class="logout"
            >退出登录</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import "@/static/css/header-bar.css";
import { State } from "@/store";
import { defineComponent } from "vue";
import { Store, useStore } from "vuex";
import * as ty from "@/store/MyType";
import { useRoute } from "vue-router";

export default defineComponent({
  data() {
    return {
      showSelect: false,
      isFullscreen: false,
    };
  },
  setup() {
    const store: Store<State> = useStore();
    const router = useRoute();
    return {
      store,
      router,
    };
  },
  methods: {
    clickSelect() {
      this.$data.showSelect = !this.$data.showSelect;
    },
    logout() {
      this.store.commit(ty.REMOVE);
    },
  },
});
</script>
