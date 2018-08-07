<template>
  <v-container>
    <v-layout row wrap class="mt-2">
      <v-flex xs12 sm6 class="text-xs-center text-sm-right">
        <v-btn large class="info" to="/meetups">Explore Meetups</v-btn>
      </v-flex>
      <v-flex xs12 sm6 class="text-xs-center text-sm-left">
        <v-btn large class="info" to="/meetup/new">Organize Meetups</v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular v-if="loading" :size="70" :width="7" indeterminate color="primary"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout v-if="!loading" row wrap class="mt-2">
      <v-flex xs12>
        <!--<v-carousel style="height: 100%">-->
        <v-carousel style="cursor: pointer">
          <v-carousel-item v-for="meetup in meetups" :key="meetup.id" :src="meetup.imageUrl" @click.native="onLoadMeetup(meetup.id)">

            <div class="title">{{ meetup.title }}</div>
          </v-carousel-item>
        </v-carousel>
        <!--<v-container fill-height fluid>
              <v-layout v-layout align-end justify-center row fill-height>
                <v-flex xs8 sm4>
                  <div class="mb-5 headline secondary font-weight-thin warning--text text-xs-center">{{ meetup.title }}</div>
                </v-flex>
              </v-layout>
            </v-container>-->
      </v-flex>
    </v-layout>
    <v-layout row wrap class="mt-2">
      <v-flex xs12 class="text-xs-center">
        <p>Join our awesome meetups!</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  computed: {
    meetups() {
      return this.$store.getters.featuredMeetups;
      //return this.$store.getters.loadedMeetups(state);
    },
    loading() {
      return this.$store.getters.loading;
    }
  },
  methods: {
    onLoadMeetup(id) {
      this.$router.push("/meetups/" + id);
    }
  }
};
</script>
<!--<style scoped>
// V--USAGE--V  :gradient="gradient"
      //gradient: "to top right, rgba(0,0,0, 1), rgba(125,132,172, .7)", //#7B1FA2, #E1BEE7"
      //gradient: "to right, rgba(0,0,0, 0.5), rgba(0,0,0, 0.5)" //#7B1FA2, #E1BEE7"

.title {
  position: absolute;
  left: 35%;
  right: 35%;
  bottom: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 1em;
}
</style>-->
