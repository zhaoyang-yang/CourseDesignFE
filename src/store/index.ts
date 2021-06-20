import { createStore, MutationTree } from "vuex";
import * as ty from "./MyType";
import { User } from "./MyType";

export interface State {
  user: {id: number|null,name: string|null,type: number|null};
  token: string | null;
}

const MyState: State = {
  user: JSON.parse(sessionStorage.getItem("userInfo")+"")==null? {id: -1,name: "",type: -1}: JSON.parse(sessionStorage.getItem("userInfo")+""),
  token: localStorage.getItem("token"),
};

const MyMutations: MutationTree<State> = {
  [ty.SET_TOKEN]: (state, token) => {
    state.token = token;
    localStorage.setItem("token",token);
  },
  [ty.SET_USER]: (state, user: User) => {
    state.user = user;
    sessionStorage.setItem("userInfo",JSON.stringify(user));
  },

  [ty.REMOVE]: (state) => {
    state.token = "";
    localStorage.setItem("token","");
    state.user.id = -1; state.user.name = ""; state.user.type = -1;
  },

  [ty.GET_TOKEN]: (state) => {
    return state.token;
  },
  [ty.GET_USER]: (state) => {
    return state.user;
  },
};

export default createStore({
  state: MyState,
  mutations: MyMutations,
  actions: {},
  modules: {},
});
