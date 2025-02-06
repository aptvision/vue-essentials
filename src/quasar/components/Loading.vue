<template>
  <q-layout v-if="model">
    <q-page-container>
      <q-page>
        <div class="window-height">
          <div class="row window-height items-center content-center">
            <div class="col-12 text-center">
              <q-circular-progress
                show-value
                font-size="10px"
                class="q-ma-md"
                :value="isError ? 100 : 0"
                size="140px"
                :thickness="0.1"
                :color="progressColor"
                track-color="grey-3"
                :indeterminate="isLoading"
              >
                <q-avatar size="96px">
                  <q-img :src="logo" contain />
                </q-avatar>
              </q-circular-progress>
            </div>
            <div class="col-12 text-center q-mt-md">
              <div v-if="!isError" class="text-h5 text-weight-thin">
                <p>{{ messageComputed }}</p>
              </div>
              <div v-else class="text-h5 text-red">
                <p>{{ messageComputed }}</p>
              </div>
              <template
                v-for="(button, index) in buttons"
                :key="JSON.stringify(button) + index"
              >
                <q-btn
                  v-if="!(button.inStatuses || []).length || button.inStatuses.includes(status)"
                  flat
                  class="text-primary"
                  :label="button.label"
                  @click="button.onClick"
                />
              </template>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

export type TLoadingStatus = string & 'LOADING'|'ERROR'|'INFO'
export interface ILoadingButton {
  onClick: (model) => void;
  label: string;
  inStatuses: Array<TLoadingStatus>;
}
const props = withDefaults(defineProps<{
  message: string;
  status?: TLoadingStatus;
  buttons?: Array<ILoadingButton>;
  logo: string;
}>(), {
  message: 'Essential Loading...',
  status: 'LOADING',
  buttons: () => ([])
});
const model = defineModel<boolean>()

const isError = computed(() => props.status === 'ERROR');
const isLoading = computed(() => props.status === 'LOADING');
const progressColor = computed(() => (isError.value ? 'red' : 'secondary'));
const messageComputed = computed(() => props.message);
</script>
