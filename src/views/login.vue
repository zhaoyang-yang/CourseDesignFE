<template>
  <!-- <headbar /> -->
  <!-- <sidebar /> -->
  <!-- Backgrounds -->

  <div id="login-bg" class="container-fluid">
    <div class="bg-img"></div>
    <div class="bg-color"></div>
  </div>

  <!-- End Backgrounds -->

  <div class="container" id="login">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="login">
          <h1>登录</h1>

          <!-- Loging form -->
          <form target="notjump">
            <div class="form-group">
              <input
                name="username"
                class="form-control"
                placeholder="请输入账号"
                v-model="user.id"
                @blur="tip"
                @click="out"
              />
            </div>
            <div class="form-group">
              <input
                name="password"
                type="password"
                class="form-control"
                placeholder="请输入密码"
                v-model="user.password"
                @blur="tip"
                @click="out"
              />
            </div>

            <div class="form-check">
              <label class="switch">
                <input type="checkbox" />
                <span class="slider round"></span>
              </label>
              <label class="form-check-label" for="exampleCheck1">记住我</label>

              <label class="forgot-password"><a href="#">忘记密码?</a></label>
            </div>

            <div>
              <input type="radio" v-model="user.type" value="1" />
              <label for="man">老师</label>
              <input type="radio" v-model="user.type" value="2" />
              <label for="woman">管理员</label>
            </div>

            <br />
            <button
              type="submit"
              class="btn btn-lg btn-block btn-success"
              @click="login"
            >
              登录
            </button>
          </form>
          <iframe name="notjump" style="display: none" />
          <!-- End Loging form -->
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import "@/static/css/bootstrap.min.css";
import "@/static/css/styles.css";
import axios from "axios";
import * as ty from "@/store/MyType";
import { Store, useStore } from "vuex";
import { State } from "@/store/index";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
// import headbar from "@/views/head_side/header-bar.vue";
// import sidebar from "@/views/head_side/side-bar.vue";

export default defineComponent({
  components: {
    // headbar,
    // sidebar,
  },
  data() {
    return {
      user: {
        id: 1001,
        name: "1001",
        password: "123456",
        type: 2,
      },
    };
  },

  setup() {
    const store: Store<State> = useStore();
    const router = useRouter();
    return {
      store,
      router,
    };
  },
  methods: {
    login() {
      const store: Store<State> = this.store;
      const router = this.router;
      //注释
      if (this.user.id == null || this.user.password == "")
        alert("输入用户名密码");
      else {
        //空格
        axios
          .post("http://localhost:8081/user/login", this.$data.user)
          .then((res) => {
            store.commit(ty.SET_USER, res.data.data);
            store.commit(ty.SET_TOKEN, res.headers.authorization);
            if (res.data.code != 200) ElMessage(res.data.msg);
            if (res.data.data.type == 2) router.push("/admin");
            else router.push("/teacher");
          });
      }
    },
    tip(el: any) {
      if (el.path[0].value == "") el.path[0].style.border = "red solid 1px";
    },
    out(el: any) {
      el.path[0].style.border = "none";
    },
  },
});
</script>
