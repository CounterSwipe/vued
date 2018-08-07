<template>
  <v-dialog v-model="editDialog" width="350px" persistent>
    <v-btn slot="activator" accent>
      Edit Date
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Meetup Date</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-date-picker v-model="editableDate" style="width: 100%" actions>
              <template scope="{save, cancel}">
                <v-btn class="blue--text darken-1" flat @click.native="editDialog = false">Close</v-btn>
                <v-btn class="blue--text darken-1" flat @click.native="onSaveChanges">Save</v-btn>
              </template>
            </v-date-picker>
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
      editableDate: null,
      rules: {
        required: value => !!value || "Required.",
        min: value => (value || "").length >= 5 || "Min 5 characters"
      }
    };
  },
  created() {
    /*
    Editing Date with time 1.00 A.M. gives the next date, not the chosen one:
    
    The date dialog modified the original date using the UTC based Date object methods,
    where as the time dialog used the localised versions.
    Try switching out the setUTC*() methods with set*() variants
    (e.g: setDate rather than setUTCDate) in the date dialog to perform all modifications in local time.    
    */
    const pickerDate = new Date(this.meetup.date);
    this.editableDate =
      pickerDate.getUTCFullYear() +
      "-" +
      (pickerDate.getUTCMonth() + 1) +
      "-" +
      pickerDate.getUTCDate();
    //this.editableDate = new Date(this.meetup.date);    //NOTE: am original now broken!
  },
  methods: {
    onSaveChanges() {
      //this.editDialog = false; //NOTE am didnt have this
      const newDate = new Date(this.meetup.date);
      const newDay = new Date(this.editableDate).getUTCDate();
      const newMonth = new Date(this.editableDate).getUTCMonth();
      const newYear = new Date(this.editableDate).getUTCFullYear();
      newDate.setUTCDate(newDay);
      newDate.setUTCMonth(newMonth);
      newDate.setUTCFullYear(newYear);
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
