<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h4>Create a new Meetup</h4>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12>
        <form @submit.prevent="onCreateMeetup">
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-text-field id="title" v-model="title" :rules="[rules.required, rules.min]" name="title" label="Title" counter maxlength="20"> </v-text-field>
              <!-- NOTE am uses v-layout & v-flex for each field! -->
              <v-text-field id="location" v-model="location" :rules="[rules.required]" name="location" label="Location"> </v-text-field>

              <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                  <!--<v-text-field id="image-url" v-model="imageUrl" name="imageUrl" label="Image Url"> </v-text-field>-->
                  <!-- :loading="loading" :disabled="loading" @click.native="loader = 'loading'" -->
                  <v-btn class="primary white--text" @click="onPickFile">
                    Upload Image
                    <v-icon right dark>cloud_upload</v-icon>
                  </v-btn>
                  <input ref="fileInput" type="file" style="display: none" accept="image/*" @change="onFilePicked">
                  <!-- image/png => uploads === png  -->

                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12 sm6 offset-sm3>
                  <img :src="imageUrl" width="100%">
                  <!-- height="150">-->
                </v-flex>
              </v-layout>
              <v-textarea id="description" v-model="description" :rules="[rules.required]" name="description" label="Description"> </v-textarea>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <h4>Choose a Date & Time</h4>
              <!-- vuetify DATE && TIME pickers templates mobile modal dialog etc -->
            </v-flex>
          </v-layout>
          <v-layout row class="mb-2">
            <v-flex xs12 sm6 sm3>
              <v-menu ref="menu" :close-on-content-click="false" v-model="menu" :nudge-right="40" :return-value.sync="date" lazy transition="scale-transition" offset-y full-width min-width="290px">
                <v-text-field slot="activator" v-model="date" label="Choose Date" prepend-icon="event" readonly></v-text-field>
                <v-date-picker v-model="date" @input="$refs.menu.save(date)"></v-date-picker>
              </v-menu>
            </v-flex>
            <!--
            <v-flex xs12 sm6 offset-sm3>
              <v-date-picker v-model="date"></v-date-picker>
              <p>{{ date }}</p>
            </v-flex>
            -->
          </v-layout>
          <v-layout row>
            <v-flex xs11 sm5>
              <v-menu ref="menu2" :close-on-content-click="false" v-model="menu2" :nudge-right="40" :return-value.sync="time" lazy transition="scale-transition" offset-y full-width max-width="290px" min-width="290px">
                <v-text-field slot="activator" v-model="time" label="Choose Time" prepend-icon="access_time" readonly></v-text-field>
                <v-time-picker v-if="menu2" v-model="time" format="ampm" @change="$refs.menu2.save(time)"></v-time-picker>
              </v-menu>
            </v-flex>
            <!--
            <v-flex xs12 sm6 offset-sm3>
              <v-time-picker v-model="time" format="24hr"></v-time-picker>
              <p>{{ time }}</p>
            </v-flex>
            -->
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm6 offset-sm3>
              <v-btn :disabled="!formIsValid" class="primary" type="submit">Create Meetup</v-btn>
              <!--{{ submitDateTime }}-->
            </v-flex>
          </v-layout>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      menu: false,
      menu2: false,
      title: "",
      location: "",
      imageUrl: "",
      description: "",
      date: null, //new Date(), //null,
      time: null, //new Date(), //null,
      image: null,
      rules: {
        required: value => !!value || "Required.",
        //counter: value => value.length <= 20 || "Max 20 characters",
        min: value => (value || "").length >= 5 || "Min 5 characters"
        //max: value => (value || "").length <= 20 || "Max 20 characters"
      }
    };
  },
  computed: {
    formIsValid() {
      return (
        this.title !== "" && this.location !== "" && this.description !== ""
      ); //&& this.imageUrl
    },
    submitDateTime() {
      const date = new Date(this.date);
      if (typeof this.time === "string") {
        const hours = this.time.match(/^(\d+)/)[1]; //am = let hours NOT const hours!
        const minutes = this.time.match(/:(\d+)/)[1];
        date.setHours(hours);
        date.setMinutes(minutes);
        //} else if (typeof this.time === "object") {
        //} else if (this.time === null) {
        //TODO: am doesnt have this!
        //return date;
      } else {
        date.setHours(this.time.getHours());
        date.setMinutes(this.time.getMinutes());
      }
      //console.log(date);
      return date;
    }
  },
  methods: {
    onCreateMeetup() {
      if (!this.formIsValid) {
        return;
      }
      if (!this.image) {
        return;
      }
      const meetupData = {
        title: this.title,
        location: this.location,
        //imageUrl: this.imageUrl,
        image: this.image,
        description: this.description,
        date: this.submitDateTime //this.date,
        //time: this.time
      };
      this.$store.dispatch("createMeetup", meetupData);
      this.$router.push("/meetups");
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      const files = event.target.files;
      let filename = files[0].name;
      if (filename.lastIndexOf(".") <= 0) {
        return alert("Please add a valid image!");
      }
      const fileReader = new FileReader();
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.image = files[0];
    }
  }
};
</script>
