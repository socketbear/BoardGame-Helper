<script setup lang="ts">
import { FINANCIAL_TYPE, IN_OUT } from '~/enums'
import type { IFinancial, IFinancialStatementProps } from '~/types'
const { title, typeList, financialId } = defineProps<IFinancialStatementProps>()

// 정산 이벤트 emit 추가
const emit = defineEmits(['adjust'])
// 참고: https://vuejs.org/guide/extras/reactivity-transform.html#refs-vs-reactive-variables
// $를 사용하게 되면 .value를 사용하지 않아도 되며, 전반적으로 편의성이 향상된다. 비단 ref를 제외하고 .value가 들어가는 항목에 범용적으로 활용 가능하다.
// const num = $ref(0)
const financialList: IFinancial[] = $ref([])

// financialList 내 amount를 inout이 in이면 더하고, out이면 빼서 computed로 구현
const totalAmount = $computed(() => {
  return financialList.reduce((acc, cur) => {
    if (cur.inout === IN_OUT.IN)
      return acc + cur.amount
    return acc - cur.amount
  }, 0)
})

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

const alignFinancialRows = () => {
  // financialList Array 안의 값에서 inout 값을 기준으로 정렬
  financialList.sort((a, b) => {
    if (a.inout === IN_OUT.IN && b.inout === IN_OUT.OUT)
      return -1
    if (a.inout === IN_OUT.OUT && b.inout === IN_OUT.IN)
      return 1
    return 0
  })
}

const updateData = (financial: IFinancial) => {
  // financialList Array 안에 id로 찾아 해당 값 변경
  const target = financialList.find(f => f.id === financial.id)
  if (target) {
    target.amount = financial.amount
    target.childType = financial.childType
    target.inout = financial.inout
    target.parentType = financial.parentType
    target.worth = financial.worth
  }
}

const deleteData = (financial: IFinancial) => {
  // worth 값을 financialId와 함께 정산 이벤트로 전달
  emit('adjust', { financialId, amount: financial.worth })

  // financialList Array 안에 id로 찾아 해당 값 삭제
  const target = financialList.find(f => f.id === financial.id)
  if (target) {
    const index = financialList.indexOf(target)
    financialList.splice(index, 1)
  }
}

const calTotalAmount = () => {
  // 정산 버튼을 누르면 adjust 이벤트로 totalAmount를 emit
  emit('adjust', { financialId, amount: totalAmount })
}
</script>

<template>
  <div class="w-128">
    {{ title }}
    <div class="w-full flex justify-end mb-1">
      <p class="mr-2 font-bold">
        <tools-financial-statement-currency :amount="totalAmount" />
      </p>
      <button class="flex items-center tiny-btn mr-1" @click="calTotalAmount">
        <div class="i-carbon-calculator" />
      </button>
      <button class="flex items-center tiny-btn mr-1" @click="alignFinancialRows">
        정렬 <div class="i-carbon-text-align-mixed w-4" />
      </button>
      <button class="flex items-center tiny-btn" @click="addFinancial">
        추가 <div class="i-carbon-add w-4" />
      </button>
    </div>
    <table class="w-full table-auto border border-collapse">
      <thead>
        <tr>
          <th />
          <th>수입/지출</th>
          <th>분류</th>
          <th>항목</th>
          <th>금액</th>
          <th>투자금</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tools-financial-statement-row v-for="f in financialList" :key="`finanlcial-line-${f.id}`" :row="f" :type-list="typeList" @change="updateData" @delete="deleteData" />
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

