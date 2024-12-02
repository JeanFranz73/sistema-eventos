<script>
import usersApi from '@/api/users.api';

export default {
  name: 'Finish',

  data: () => ({
    loading: false,
    hasError: false,
    password: '',
    confirmPassword: '',
    userId: 0
  }),

  mounted() {
  const urlParams = new URLSearchParams(window.location.search);
  const paramValue = urlParams.get('id'); // Replace 'paramName' with the actual parameter name
  this.userId = paramValue;
  },

  methods: {
    async finishLogin() {
      const { valid } = await this.$refs.formFinish.validate()

      if (valid) try {
        this.loading = true
        this.hasError = false

        await usersApi.changePassword(this.userId, '', this.password)

        this.$router.push('/login')

      } catch (error) {
        console.error(error)
        this.hasError = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <v-container class="fill-height">
    <v-responsive
      class="align-centerfill-height mx-auto"
      max-width="500"
    >
      <v-row>
        <v-col>
          <v-card title="Finalizar cadastro">
            <v-form
              ref="formFinish"
              @submit.prevent="finishLogin"
            >
              <v-card-text class="pb-0">
                <v-text-field
                  v-model="password"
                  :disabled="loading"
                  type="password"
                  label="Senha"
                  :rules="[v => !!v|| 'Campo obrigatório']"
                />
                <v-text-field
                  v-model="confirmPassword"
                  :disabled="loading"
                  type="password"
                  :rules="[v => (!!v && v === password) || 'Campo obrigatório']"
                  label="Senha"
                />
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn
                  type="submit"
                  color="primary"
                  :loading
                  variant="tonal"
                >
                  Finalizar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
          <p
            v-if="hasError"
            class="text-subtitle-1 mt-2 text-red text-center"
          >
            Ocorreu um erro.
          </p>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>
