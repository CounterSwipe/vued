import firebase from "firebase/app";
import "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
//import * as firebase from "firebase";

export default {
  state: {
    loadedMeetups: [
      /*{
        // eslint-disable-next-line
        imageUrl: "https://images1.apartments.com/i2/ejCfXE7iBj8E0ZuhAfC8fqJ2xoL7L-11i4AM5co_kBc/117/astor-broadway-astoria-ny-primary-photo.jpg",
        id: "adfasdf123asd",
        title: "MEETUP IN NYC",
        date: new Date(), //"2017-08-7",
        location: "NYC",
        description: "awesome"
      },
      {
        // eslint-disable-next-line
        imageUrl: "http://d2kcmk0r62r1qk.cloudfront.net/imageSponsors/xlarge/2015_06_12_02_59_16_29-10broadway_rendering.jpg",
        id: "aeasdfa243562",
        title: "Meetup in Paris",
        date: new Date(), //"2017-8-19",
        location: "Paris",
        description: "french's awesome"
      }*/
    ]
  },
  mutations: {
    //NEVER run fb sync code here!
    setLoadedMeetups(state, payload) {
      state.loadedMeetups = payload;
    },
    createMeetup(state, payload) {
      state.loadedMeetups.push(payload);
    },
    updateMeetup(state, payload) {
      const meetup = state.loadedMeetups.find(meetup => {
        return meetup.id === payload.id;
        //NOTE -> comments vid#20 returns array?
      });
      //TODO -> have firebase handle this if updated?!
      if (payload.title) {
        meetup.title = payload.title;
      }
      if (payload.description) {
        meetup.description = payload.description;
      }
      if (payload.date) {
        meetup.date = payload.date;
      }
    }
  },
  actions: {
    //run fb async code here
    //NOTE: vid#22: store the registrations as user id's in the meetup objects
    //That would make it easier to create something like a guest list for instance
    //iow each meetup just adds the userids that are registered with it
    //& each user registeredMeetups[] containes all meetupIds its registered with etc
    //research VuexFire plugin! -> update fb -> fb updates store in real time
    loadMeetups({ commit }) {
      commit("setLoading", true);
      firebase
        .database()
        .ref("meetups")
        .once("value")
        .then(data => {
          const meetups = [];
          const obj = data.val();
          for (let key in obj) {
            meetups.push({
              id: key,
              title: obj[key].title,
              location: obj[key].location,
              description: obj[key].description,
              imageUrl: obj[key].imageUrl,
              date: obj[key].date,
              creatorId: obj[key].creatorId
            });
          }
          commit("setLoadedMeetups", meetups);
          commit("setLoading", false);
        })
        .catch(error => {
          console.log(error);
          commit("setLoading", false);
        });
    },
    createMeetup({ commit, getters }, payload) {
      const meetup = {
        title: payload.title,
        location: payload.location,
        //imageUrl: payload.imageUrl,
        description: payload.description,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
        //date: payload.date,
        //time: payload.time //NOTE am didnt add this!
        //id: Math.floor(Math.random() * 10000).toString()
      };
      let imageUrl;
      let key;
      firebase
        .database()
        .ref("meetups")
        .push(meetup)
        .then(data => {
          key = data.key;
          //const key = data.key;
          //commit("createMeetup", {
          //...meetup,
          //id: key
          //});
          return key;
        })
        .then(key => {
          const filename = payload.image.name;
          const ext = filename.slice(filename.lastIndexOf("."));
          return (
            firebase
              .storage()
              .ref("meetups/" + key + "." + ext)
              //.ref("meetups/" + key + ext)//NOTE: may not need "."
              .put(payload.image)
          );
        })
        .then(filedata => {
          let imagePath = filedata.metadata.fullPath;
          // creating ref to our image file and get the url
          return firebase
            .storage()
            .ref()
            .child(imagePath)
            .getDownloadURL();
        })
        .then(url => {
          imageUrl = url;
          return firebase
            .database()
            .ref("meetups")
            .child(key)
            .update({
              imageUrl: imageUrl
            });
        })
        /*
        .then(fileData => {
          imageUrl = fileData.metadata.fullPath;
          //imageUrl = fileData.metadata.downloadURLs[0];
          //NOTE -> might be getMetadata etc not metadata
          //NOTE -> might be fullPath not dlURLs!
          return firebase
            .database()
            .ref("meetups")
            .child(key)
            .update({
              imageUrl: imageUrl
            });
        })*/
        .then(() => {
          commit("createMeetup", {
            ...meetup,
            imageUrl: imageUrl,
            id: key
          });
        })
        .catch(error => {
          console.log(error);
        });
    },
    updateMeetupData({ commit }, payload) {
      commit("setLoading", true);
      const updateObj = {};
      if (payload.title) {
        updateObj.title = payload.title;
      }
      if (payload.description) {
        updateObj.description = payload.description;
      }
      if (payload.date) {
        updateObj.date = payload.date;
      }
      firebase
        .database()
        .ref("meetups")
        .child(payload.id)
        .update(updateObj)
        .then(() => {
          commit("setLoading", false);
          commit("updateMeetup", payload);
        })
        .catch(error => {
          console.log(error);
          commit("setLoading", false);
        });
    }
  },
  getters: {
    loadedMeetups(state) {
      return state.loadedMeetups.sort((meetupA, meetupB) => {
        return meetupA.date > meetupB.date;
      });
    },
    featuredMeetups(state, getters) {
      return getters.loadedMeetups.slice(0, 5);
    },
    loadedMeetup(state) {
      return meetupId => {
        return state.loadedMeetups.find(meetup => {
          return meetup.id === meetupId;
          //TODO: may need parseInt() ?
        });
      };
    }
  }
};
