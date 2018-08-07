<template>
  <v-dialog v-model="editDialog" width="350px" persistent>
    <v-btn slot="activator" accent>
      Edit Time
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Meetup Time</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-time-picker v-model="editableTime" style="width: 100%" actions format="24hr">
              <template scope="{save, cancel}">
                <v-btn class="blue--text darken-1" flat @click.native="editDialog = false">Close</v-btn>
                <v-btn class="blue--text darken-1" flat @click.native="onSaveChanges">Save</v-btn>
              </template>
            </v-time-picker>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["meetup"],
  data() {
    return {
      editDialog: false,
      editableTime: null,
      rules: {
        required: value => !!value || "Required.",
        min: value => (value || "").length >= 5 || "Min 5 characters"
      }
    };
  },
  created() {
    /*const pickerDate = new Date(this.meetup.date);
    this.editableDate =
      pickerDate.getUTCFullYear() +
      "-" +
      (pickerDate.getUTCMonth() + 1) +
      "-" +
      pickerDate.getUTCDate();*/
    //this.editableTime = new Date(this.meetup.date).toTimeString(); //am original broken
    let date = new Date(this.meetup.date);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    this.editableTime = hours + ":" + minutes;
  },
  methods: {
    onSaveChanges() {
      //this.editDialog = false; //NOTE am didnt have this
      const newDate = new Date(this.meetup.date);
      const hours = this.editableTime.match(/^(\d+)/)[1];
      const minutes = this.editableTime.match(/:(\d+)/)[1];
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      this.$store.dispatch("updateMeetupData", {
        id: this.meetup.id,
        date: newDate
      });
      /*if (
        this.editedTitle.trim() === "" ||
        this.editedDescription.trim() === ""
      ) {
        return;
      }
      this.editDialog = false;
      this.$store.dispatch("updateMeetupData", {
        id: this.meetup.id,
        title: this.editedTitle,
        description: this.editedDescription
      });*/
    }
  }
};
</script>
