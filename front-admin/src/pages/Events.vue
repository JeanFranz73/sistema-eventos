<script>
import emailsApi from '@/api/emails.api';
import eventsApi from '@/api/events.api';

import { useAppStore } from '@/stores/app.store';
import { useUserStore } from '@/stores/user.store';
import { mapState } from 'pinia';

export default {
  name: 'Events',

  data: () => ({
    loading: false,
    loadingMyEvents: false,
    dialogEventDetails: false,
    events: [],
    eventDetails: {},
    headers: [
      { title: 'ID', value: 'id' },
      { title: 'Nome', value: 'name' },
      { title: 'Descrição', value: 'description' },
      { title: 'Data', value: 'date' },
      { title: 'Participantes', value: 'participants' },
      { title: 'Ações', value: 'actions', sortable: false, align: 'end' },
    ],
  }),

  computed: {
    ...mapState(useAppStore, ['isOffline']),
    ...mapState(useUserStore, ['isAdmin', 'getUserId']),
  },

  async created() {
    await this.fetchEvents()
  },

  methods: {
    async fetchEvents() {
      try {
        this.loading = true
        this.loadingMyEvents = true
        let events = await eventsApi.getEvents()
        this.events = events.data
        this.loading = false

        let myEvents = await eventsApi.getRegistrationsByUserId(this.getUserId)
        let myEventIds = myEvents.data.map(event => event.id);

        this.events = this.events.map(event => ({
          ...event,
          subscribed: myEventIds.includes(event.id)
        }))
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
        this.loadingMyEvents = false
      }
    },

    openEventDetails(event, row) {
      this.eventDetails = row.item
      this.dialogEventDetails = true
    }
  }
}
</script>

<template>
  <v-app>
    <v-layout>
      <v-main>
        <v-container>
          <v-row v-if="isAdmin">
            <v-col>
              <v-btn
                prepend-icon="mdi-plus"
                text="Novo evento"
                elevation="0"
                @click="openEditEvent({ id: 0 })"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-data-table-virtual
                :loading
                class="rounded"
                :headers="headers"
                :items="events"
                item-key="name"
                @click:row="openEventDetails"
              >
                <template #item.actions="{ item }">
                  <v-tooltip
                    v-if="!isAdmin"
                    text="Inscrever-se"
                    location="top"
                  >
                    <template #activator="{ props }">
                      <v-btn
                        v-if="!isOffline"
                        :disabled="item.subscribed"
                        :loading="loadingMyEvents"
                        v-bind="props"
                        class="mr-2"
                        color="primary"
                        icon="mdi-location-enter"
                        variant="tonal"
                        size="x-small"
                        rounded
                        @click="$router.push('/login')"
                      />
                    </template>
                  </v-tooltip>
                </template>
              </v-data-table-virtual>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-layout>
  </v-app>

  <event-details
    v-model="dialogEventDetails"
    :event="eventDetails"
  />
</template>
