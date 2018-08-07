export default {
  state: {
    loading: false,
    error: null
  },
  mutations: {
    //NEVER run fb sync code here!
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    clearError(state) {
      state.error = null;
    }
  },
  actions: {
    //run fb async code here
    clearError({ commit }) {
      commit("clearError");
    }
  },
  getters: {
    loading(state) {
      return state.loading;
    },
    error(state) {
      return state.error;
    }
  }
};
