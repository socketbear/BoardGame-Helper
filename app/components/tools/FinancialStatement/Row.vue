<script setup lang="ts">
import type { IFinancial, IFinancialTypeList } from '~/types/RichTypes'
import { FINANCIAL_TYPE, IN_OUT } from '~/types/RichEnums'

const props = defineProps<{
  fId: string
  amount: number
  childType: string
  inout: IN_OUT
  parentType: string
  worth: number
  typeList: IFinancialTypeList[]
}>()

const emit = defineEmits(['change', 'delete', 'update:inout', 'update:parentType', 'update:childType'])

const { info } = useLogger()

const { fId, amount, childType, inout, parentType, worth, typeList } = useVModels(props, emit)

const targetParentType = computed(() => {
  const target = typeList.value.find(t => t.id === parentType.value)
  info('targetParentType', parentType.value, typeList.value)
  if (target)
    return target
  throw new Error('PARENT 없는 타입.')
})

const mapParentType = computed(() => {
  return typeList.value.filter((t) => {
    if (inout.value === IN_OUT.IN) {
      // 'out' 은 제외
      return t.id !== 'out'
    }
    else {
      return t.id === 'out' || t.id === 'unknown'
    }
  })
})

const targetChildType = computed(() => {
  info('[computed] targetChildType', targetParentType.value.children, childType.value)
  const target = targetParentType.value.children.find(t => t.id === childType.value)
  if (target)
    return target
  throw new Error('CHILD 없는 타입.')
})

const isChildTypeView = ref(false)

watch(
  () => targetChildType.value.id,
  (newId) => {
    info('[watch] targetChildType id:', newId, 'isChildTypeView:', isChildTypeView.value)
    if (newId !== FINANCIAL_TYPE.CHILD_UNKNOWN && !isChildTypeView.value) {
      isChildTypeView.value = true
    }
  },
)

function toogleChildTypeView() {
  isChildTypeView.value = !isChildTypeView.value
}
</script>

<template>
  <tr class="border-t">
    <td class="px-1">
      <div class="i-carbon-sync-settings" @click="toogleChildTypeView" />
    </td>
    <template v-if="!isChildTypeView">
      <td>
        <ElSelect
          v-model="inout"
          class="w-full"
          popper-class="min-w-[120px]"
        >
          <ElOption
            :value="IN_OUT.IN"
            label="수입"
            class="!py-2 !text-base !text-green-800"
          />
          <ElOption
            :value="IN_OUT.OUT"
            label="지출"
            class="!py-2 !text-base !text-red-800"
          />
        </ElSelect>
      </td>
      <td>
        <ElSelect
          v-model="parentType"
          class="w-full"
        >
          <ElOption
            v-for="tp in mapParentType"
            :key="`finanlcial-line-${fId}-ftype-${tp.id}`"
            :value="tp.id"
            :label="tp.name"
          />
        </ElSelect>
      </td>
      <td>
        <ElSelect
          v-model="childType"
          class="w-full"
        >
          <ElOption
            v-for="tp in targetParentType.children"
            :key="`finanlcial-line-${fId}-ftype-${tp.id}`"
            :value="tp.id"
            :label="tp.name"
          />
        </ElSelect>
      </td>
    </template>
    <template v-else>
      <td colspan="3" class="text-left" :class="{ 'text-green-800': inout === IN_OUT.IN, 'text-red-800': inout === IN_OUT.OUT }" @click="toogleChildTypeView">
        {{ targetChildType.name }}
      </td>
    </template>
    <td><tools-financial-statement-currency :amount="amount" /></td>
    <td><tools-financial-statement-currency :amount="worth" /></td>
    <td>
      <button class="tiny-del-btn my-1" @click="emit('delete', { id: fId, worth })">
        삭제
      </button>
    </td>
  </tr>
</template>
