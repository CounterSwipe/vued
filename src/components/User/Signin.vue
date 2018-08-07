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
              <form @submit.prevent="onSignin">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field id="email" v-model="email" :rules="[rules.required]" name="email" label="Mail" type="email"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <!-- am -> rules comparePW -->
                    <v-text-field id="password" v-model="password" :rules="[rules.required]" name="password" label="Password" type="password"></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <!-- add disabled until all fields complete etc -->
                    <v-btn :loading="loading" :disabled="loading" type="submit">
                      Sign In
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
      rules: {
        required: v => !!v || "This field is required"
      }
    };
  },
  computed: {
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
    onSignin() {
      //Vuex
      this.$store.dispatch("signUserIn", {
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
