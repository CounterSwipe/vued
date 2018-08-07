<template>
  <v-dialog v-model="editDialog" width="350px" persistent>
    <v-btn slot="activator" fab accent>
      <v-icon>edit</v-icon>
    </v-btn>
    <v-card>
      <v-container>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-title>Edit Meetup</v-card-title>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-text>
              <v-text-field id="title" v-model="editedTitle" :rules="[rules.required, rules.min]" name="title" label="Title" counter maxlength="20"> </v-text-field>
              <v-textarea id="description" v-model="editedDescription" :rules="[rules.required]" name="description" label="Description"> </v-textarea>
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-divider> </v-divider>
        <v-layout row wrap>
          <v-flex xs12>
            <v-card-actions>
              <v-btn flat class="primary--text" @click="editDialog = false">Close</v-btn>
              <v-btn flat class="blue--text darken-1" @click="onSaveChanges">Save</v-btn>
            </v-card-actions>
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
      editedTitle: this.meetup.title,
      editedDescription: this.meetup.description,
      rules: {
        required: value => !!value || "Required.",
        min: value => (value || "").length >= 5 || "Min 5 characters"
      }
    };
  },
  methods: {
    onSaveChanges() {
      if (
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
      });
    }
  }
};
</script>
