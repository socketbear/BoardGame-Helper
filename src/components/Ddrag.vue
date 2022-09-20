<script setup lang="ts">
import draggable from 'vuedraggable'

interface ITest {
  id: string
  text: string
}
const arrayData: ITest[] = $ref([])
const count = ref(0)
const addData = () => {
  arrayData.push({
    id: getUniqueId(),
    text: `test${count.value++}`,
  })
}
</script>

<template>
  <div>
    <div class="flex justify-end mb-2">
      <button class="flex items-center tiny-btn" @click="addData">
        추가 <div class="i-carbon-add w-4" />
      </button>
    </div>
    <draggable v-model="arrayData" item-key="id" :options="{ group: 'financial', animation: 150 }">
      <template #item="{ element }">
        <div class="flex justify-between items-center border border-gray-300 p-2">
          <div class="flex items-center">
            <div class="i-carbon-drag w-4" />
            <div class="ml-2">
              {{ element.text }}
            </div>
          </div>
          <div class="flex items-center">
            <button class="flex items-center tiny-btn mr-1">
              <div class="i-carbon-edit w-4" />
            </button>
            <button class="flex items-center tiny-btn">
              <div class="i-carbon-delete w-4" />
            </button>
          </div>
        </div>
      </template>
    </draggable>
  </div>
</template>

  <route lang="yaml">
meta:
  layout: board
    </route>

