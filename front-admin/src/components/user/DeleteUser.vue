<script>
import usersApi from '@/api/users.api';

export default {
  name: 'DeleteUser',

  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => ({})
    },
  },

  emits: ['update:modelValue'],

  data: () => ({
    loading: false,
  }),

  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    },
    userDelete() {
      return this.user
    }
  },

  methods: {
    async deleteUser() {
      try {
        this.loading = true
        await usersApi.deleteUser(this.userDelete.id)
        this.value = false
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <v-dialog
    v-model="value"
    max-width="500px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Deletar Usuário</span>
      </v-card-title>
      <v-card-text>
        Tem certeza que deseja deletar o usuário {{ userDelete.name }}?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          :loading
          @click="value = false"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          :loading
          @click="deleteUser"
        >
          Deletar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
