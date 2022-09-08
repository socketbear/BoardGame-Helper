<script setup lang="ts">
import { FINANCIAL_TYPE, IN_OUT } from '~/enums'
import type { IFinancial, IFinancialStatementProps } from '~/types'
const { title, typeList } = defineProps<IFinancialStatementProps>()
const financialList: IFinancial[] = reactive([])

const num = $ref(0)

const addFinancial = () => {
  financialList.push({
    amount: 0,
    id: getUniqueId(),
    worth: 0,
    childType: FINANCIAL_TYPE.CHILD_UNKNOWN,
    parentType: FINANCIAL_TYPE.PARENT_UNKNOWN,
    inout: IN_OUT.IN,
  })
}
</script>

<template>
  <div class="w-128">
    {{ title }}
    <div class="w-full flex justify-end mb-1">
      <button class="flex items-center tiny-btn mr-1">
        정렬 <div class="i-carbon-text-align-mixed w-4" />
      </button>
      <button class="flex items-center tiny-btn" @click="addFinancial">
        추가 <div class="i-carbon-add w-4" />
      </button>
    </div>
    <table class="w-full table-auto border border-collapse">
      <thead>
        <th />
        <th>수입/지출</th>
        <th>분류</th>
        <th>항목</th>
        <th>금액</th>
        <th>투자금</th>
        <th />
      </thead>
      <tbody>
        <tools-financial-statement-row v-for="f in financialList" :key="`finanlcial-line-${f.id}`" :row="f" :type-list="typeList" />
      </tbody>
    </table>
  </div>
</template>

<style scoped>

</style>

<route lang="yaml">
meta:
  layout: board
</route>
