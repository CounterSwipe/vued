<template>
  <v-container>
    <v-layout v-if="loading" row wrap>
      <v-flex xs12 class="text-xs-center">
        <v-progress-circular v-if="loading" :size="70" :width="7" indeterminate color="primary"></v-progress-circular>
      </v-flex>
    </v-layout>
    <v-layout v-else row wrap>
      <v-flex xs12>
        <v-card>
          <v-card-title>
            <h4 class="primary--text">{{ meetup.title }}</h4>
            <template v-if="userIsCreator">
              <v-spacer></v-spacer>
              <app-edit-meetup-details-dialog :meetup="meetup"></app-edit-meetup-details-dialog>
            </template>
          </v-card-title>
          <v-card-media :src="meetup.imageUrl" height="200px"></v-card-media>
          <!--<v-container fill-height fluid>
              <v-layout v-layout align-end justify-center row fill-height>
                <v-flex xs10 sm4 class="secondary">
                  <div class="headline font-weight-thin warning--text text-xs-center">MEETUP IN NYC</div>
                </v-flex>
              </v-layout>
            </v-container>-->
          <v-card-text>
            <div class="info--text">{{ meetup.date | date }} - {{ meetup.location }}</div>
            <div>
              <app-edit-meetup-date-dialog v-if="userIsCreator" :meetup="meetup"></app-edit-meetup-date-dialog>
              <app-edit-meetup-time-dialog v-if="userIsCreator" :meetup="meetup"></app-edit-meetup-time-dialog>
            </div>
            <div>{{ meetup.description }}</div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <app-meetup-register-dialog v-if="userIsAuthenticated && !userIsCreator" :meetupId="meetup.id"></app-meetup-register-dialog>
          </v-card-actions>

        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  props: ["id"],
  computed: {
    meetup() {
      return this.$store.getters.loadedMeetup(this.id);
    },
    userIsAuthenticated() {
      return (
        this.$store.getters.user !== null &&
        this.$store.getters.user !== undefined
      );
    },
    userIsCreator() {
      if (!this.userIsAuthenticated) {
        return false;
      }
      return this.$store.getters.user.id === this.meetup.creatorId;
    },
    loading() {
      return this.$store.getters.loading;
    }
  }
};
</script>
