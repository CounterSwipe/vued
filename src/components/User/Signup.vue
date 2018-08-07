<template>
  <v-container>
    <v-layout v-if="error" row>
      <v-flex xs12 sm6 offset-sm3>
        <app-alert :text="error.message" @dismissed="onDismissed"></app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignup">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field id="email" v-model="email" :rules="[rules.required]" name="email" label="Mail" type="email"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <!-- am -> rules comparePW -->
                    <v-text-field id="password" v-model="password" :rules="[rules.length(4)]" name="password" label="Password" type="password"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field id="confirmPassword" v-model="confirmPassword" :rules="[comparePasswords]" name="confirmPassword" label="Confirm Password" type="password"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <!-- add disabled until pw min6char & match confirmPW etc -->
                    <v-btn :loading="loading" :disabled="loading" type="submit">
                      Sign Up
                      <v-icon light right>cached</v-icon>

                    </v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      rules: {
        //email: v => (v || '').match(/@/) || 'Please enter a valid email',
        length: len => v =>
          (v || "").length >= len ||
          `Invalid character length, required ${len}`,
        //password: v => (v || '').match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/) ||
        //'Password must contain an upper case letter, a numeric character, and a special character',
        required: v => !!v || "This field is required"
      }
    };
  },
  computed: {
    comparePasswords() {
      return this.password !== this.confirmPassword
        ? "Passwords do not match"
        : true;
      //return this.password !== this.confirmPassword
      //? "Passwords do not match!"
      //: "";
    },
    user() {
      return this.$store.getters.user;
    },
    error() {
      return this.$store.getters.error;
    },
    loading() {
      return this.$store.getters.loading;
    }
  },
  watch: {
    user(value) {
      if (value !== null && value !== undefined) {
        this.$router.push("/");
      }
    }
  },
  methods: {
    onSignup() {
      //Vuex
      /*console.log({
        email: this.email,
        password: this.password,
        confirmPassword: this.confirmPassword
      });*/
      this.$store.dispatch("signUserUp", {
        email: this.email,
        password: this.password
      });
    },
    onDismissed() {
      this.$store.dispatch("clearError");
    }
  }
};
</script>
