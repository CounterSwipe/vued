import firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
//import * as firebase from "firebase";

export default {
  state: {
    user: null //{ id: "adfsdfa96", registeredMeetups: ["aeasdfa243562"] }
  },
  mutations: {
    //NEVER run fb sync code here!
    registerUserForMeetup(state, payload) {
      const id = payload.id;
      if (
        state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0
      ) {
        return;
      }
      state.user.registeredMeetups.push(id);
      state.user.fbKeys[id] = payload.fbKey;
    },
    unregisterUserFromMeetup(state, payload) {
      const registeredMeetups = state.user.registeredMeetups;
      registeredMeetups.splice(
        registeredMeetups.findIndex(meetup => meetup.id === payload),
        1
      );
      //NOTE: wasnt in am -> but bugfix for multiple registrations etc
      //https://github.com/academind/yt-devmeetup-vue-firebase/issues/7
      //registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup === payload), 1)

      Reflect.deleteProperty(state.user.fbKeys, payload);
    },
    setUser(state, payload) {
      state.user = payload;
    }
  },
  actions: {
    //run fb async code here
    //NOTE: vid#22: store the registrations as user id's in the meetup objects
    //That would make it easier to create something like a guest list for instance
    //iow each meetup just adds the userids that are registered with it
    //& each user registeredMeetups[] containes all meetupIds its registered with etc
    //research VuexFire plugin! -> update fb -> fb updates store in real time
    registerUserForMeetup({ commit, getters }, payload) {
      commit("setLoading", true);
      const user = getters.user;
      firebase
        .database()
        .ref("/users/" + user.id)
        .child("/registrations/")
        .push(payload)
        .then(data => {
          commit("setLoading", false);
          commit("registerUserForMeetup", {
            id: payload,
            fbKey: data.key
          });
        })
        .catch(error => {
          console.log(error);
          commit("setLoading", false);
        });
    },
    unregisterUserFromMeetup({ commit, getters }, payload) {
      commit("setLoading", true);
      const user = getters.user;
      if (!user.fbKeys) {
        return;
      }
      const fbKey = user.fbKeys[payload];
      firebase
        .database()
        .ref("/users/" + user.id + "/registrations/")
        .child(fbKey)
        .remove()
        .then(() => {
          commit("setLoading", false);
          commit("unregisterUserFromMeetup", payload);
        })
        .catch(error => {
          console.log(error);
          commit("setLoading", false);
        });
    },
    signUserUp({ commit }, payload) {
      commit("setLoading", true);
      commit("clearError");
      firebase
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          commit("setLoading", false);
          const newUser = {
            id: user.user.uid, //am -> user.id
            registeredMeetups: [],
            fbKeys: {}
          };
          commit("setUser", newUser);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setError", error);
          console.log(error);
        });
    },
    signUserIn({ commit }, payload) {
      commit("setLoading", true);
      commit("clearError");
      firebase
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(user => {
          commit("setLoading", false);
          const newUser = {
            id: user.user.uid, //am -> user.id
            registeredMeetups: [], //TODO!!
            fbKeys: {}
          };
          commit("setUser", newUser);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setError", error);
          console.log(error);
        });
    },
    autoSignIn({ commit }, payload) {
      commit("setUser", {
        id: payload.uid,
        registeredMeetups: [],
        fbKeys: {}
      });
    },
    fetchUserData({ commit, getters }) {
      commit("setLoading", true);
      firebase
        .database()
        .ref("/users/" + getters.user.id + "/registrations/")
        .once("value")
        .then(data => {
          const dataPairs = data.val();
          let registeredMeetups = [];
          let swappedPairs = {};
          for (let key in dataPairs) {
            registeredMeetups.push(dataPairs[key]);
            swappedPairs[dataPairs[key]] = key;
          }
          const updatedUser = {
            id: getters.user.id,
            registeredMeetups: registeredMeetups,
            fbKeys: swappedPairs
          };
          commit("setLoading", false);
          commit("setUser", updatedUser);
        })
        .catch(error => {
          commit("setLoading", false);
          commit("setError", error);
          console.log(error);
        });
    },
    logout({ commit }) {
      firebase.auth().signOut();
      commit("setUser", null);
    }
  },
  getters: {
    user(state) {
      return state.user;
    }
  }
};
