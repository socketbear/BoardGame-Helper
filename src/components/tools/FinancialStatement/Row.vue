<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue'
import { IN_OUT } from '~/enums'
import type { IFinancial, IFinancialTypeList } from '~/types'
const { row, typeList } = defineProps<{
  row: IFinancial
  typeList: IFinancialTypeList[]
}>()
const emit = defineEmits(['change', 'delete'])
const financial: IFinancial = reactive({
  id: row.id,
  inout: row.inout,
  parentType: row.parentType,
  childType: row.childType,
  worth: row.worth,
  amount: row.amount,
})

const parentType = computed(() => {
  const target = typeList.find(t => t.id === financial.parentType)
  if (target)
    return target
  throw new Error('PARENT 없는 타입.')
})

const childType = computed(() => {
  const target = parentType.value.children.find(t => t.id === financial.childType)
  if (target)
    return target
  return parentType.value.children[0]
})

const updateData = () => {
  emit('change', financial)
}

watchEffect(() => {
  financial.childType = parentType.value.children[0].id
  updateData()
})
watchEffect(() => {
  const { worth, amount } = childType.value
  financial.worth = worth
  financial.amount = amount
  updateData()
})
</script>

<template>
  <tr class="border-t">
    <td><div class="i-carbon-menu" /></td>
    <td>
      <Listbox v-model="financial.inout">
        <ListboxButton>
          <p v-if="financial.inout === IN_OUT.IN" class="text-green-800">
            수입
          </p>
          <p v-else-if="financial.inout === IN_OUT.OUT" class="text-red-800">
            지출
          </p>
        </ListboxButton>
        <ListboxOptions class="bg-white ">
          <ListboxOption class="tiny-btn" :value="IN_OUT.IN">
            수입
          </ListboxOption>
          <ListboxOption class="tiny-btn" :value="IN_OUT.OUT">
            지출
          </ListboxOption>
        </ListboxOptions>
      </Listbox>
    </td>
    <td>
      <Listbox v-model="financial.parentType">
        <ListboxButton>
          {{ parentType.name }}
        </ListboxButton>
        <ListboxOptions class="bg-white">
          <ListboxOption v-for="tp in typeList" :key="`finanlcial-line-${financial.id}-ftype-${tp.id}`" class="tiny-btn" :value="tp.id">
            {{ tp.name }}
          </ListboxOption>
        </ListboxOptions>
      </Listbox>
    </td>
    <td>
      <Listbox v-model="financial.childType">
        <ListboxButton>
          {{ childType.name }}
        </ListboxButton>
        <ListboxOptions class="bg-white ">
          <ListboxOption v-for="tp in parentType.children" :key="`finanlcial-line-${financial.id}-ftype-${tp.id}`" class="tiny-btn" :value="tp.id">
            {{ tp.name }}
          </ListboxOption>
        </ListboxOptions>
      </Listbox>
    </td>
    <td><tools-financial-statement-currency :amount="financial.amount" /></td>
    <td><tools-financial-statement-currency :amount="financial.worth" /></td>
    <td>
      <button class="tiny-del-btn my-1" @click="emit('delete', financial)">
        삭제
      </button>
    </td>
  </tr>
</template>
