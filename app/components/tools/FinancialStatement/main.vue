<script setup lang="ts">
import type { IFinancial, IFinancialStatementProps, IFinancialType, IFinancialTypeList } from '~/types/RichTypes'
import { FINANCIAL_TYPE, IN_OUT } from '~/types/RichEnums'

const { title, typeList, financialId } = defineProps<IFinancialStatementProps>()

// 정산 이벤트 emit 추가
const emit = defineEmits(['adjust'])

const { getUniqueId } = useUtils()

const financialList = ref<IFinancial[]>([])

const { info } = useLogger()

// financialList 내 amount를 inout이 in이면 더하고, out이면 빼서 computed로 구현
const totalAmount = computed(() => {
  return financialList.value.reduce((acc, cur) => {
    if (cur.inout === IN_OUT.IN)
      return acc + cur.amount
    return acc - cur.amount
  }, 0)
})

function addFinancial() {
  financialList.value.push({
    amount: 0,
    id: getUniqueId(),
    worth: 0,
    childType: FINANCIAL_TYPE.CHILD_UNKNOWN,
    parentType: FINANCIAL_TYPE.PARENT_UNKNOWN,
    inout: IN_OUT.IN,
  })
}

function alignFinancialRows() {
  // financialList Array 안의 값에서 inout 값을 기준으로 정렬
  financialList.value.sort((a, b) => {
    if (a.inout === IN_OUT.IN && b.inout === IN_OUT.OUT)
      return -1
    if (a.inout === IN_OUT.OUT && b.inout === IN_OUT.IN)
      return 1
    return 0
  })
}

// parentType, childType 정보로 typeList 에서 해당 object 찾아 해당 값을 변경
function searchType(typeList: IFinancialTypeList[], childTypeId: string) {
  info('searchType', { typeList, childTypeId })
  for (const parent of typeList) {
    for (const child of parent.children) {
      if (child.id === childTypeId) {
        return {
          amount: child.amount,
          worth: child.worth,
          parentType: parent.id,
          childType: child.id,
          inout: child.inout,
        }
      }
    }
  }

  return {
    amount: 0,
    worth: 0,
    inout: IN_OUT.IN,
    parentType: FINANCIAL_TYPE.PARENT_UNKNOWN,
    childType: FINANCIAL_TYPE.CHILD_UNKNOWN
  }
}

function updateChildType(id: string, childTypeId: string) {
  const target = financialList.value.find(f => f.id === id)
  if (target) {
    info('[start] updateChildType', { id, childTypeId })
    const searchedType = searchType(typeList, childTypeId)
    target.inout = searchedType.inout
    target.parentType = searchedType.parentType
    target.childType = searchedType.childType
    target.amount = searchedType.amount
    target.worth = searchedType.worth
    info('[end] updateChildType', { id, childTypeId, target, searchedType })
  }
}

function deleteData({ id, worth }: { id: string, worth: number }) {
  // worth 값을 financialId와 함께 정산 이벤트로 전달
  emit('adjust', { financialId, amount: worth })

  // financialList Array 안에 id로 찾아 해당 값 삭제
  const target = financialList.value.find(f => f.id === id)
  if (target) {
    const index = financialList.value.indexOf(target)
    financialList.value.splice(index, 1)
  }
}

function calTotalAmount() {
  // 정산 버튼을 누르면 adjust 이벤트로 totalAmount를 emit
  emit('adjust', { financialId, amount: totalAmount.value })
}
</script>

<template>
  <div class="w-128">
    {{ title }}
    <div class="mb-1 w-full flex items-center justify-end">
      <p class="mr-2 font-bold">
        <tools-financial-statement-currency :amount="totalAmount" />
      </p>
      <el-button class="tiny-btn mr-1 flex items-center" @click="calTotalAmount">
        <div class="i-carbon-calculator w-4" />
        <span class="ml-2">정산</span>
      </el-button>
      <el-button class="tiny-btn mr-1 flex items-center" @click="alignFinancialRows">
        <div class="i-carbon-text-align-mixed w-4" />
        <span class="ml-2">정렬</span>
      </el-button>
      <el-button class="tiny-btn flex items-center" @click="addFinancial">
        <div class="i-carbon-add w-4" />
        <span class="ml-2">추가</span>
      </el-button>
    </div>
    <table class="w-full border-collapse table-auto border">
      <thead>
        <tr>
          <th />
          <th>항목</th>
          <th>금액</th>
          <th>투자금</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tools-financial-statement-row
          v-for="f in financialList"
          :key="`financial-line-${f.id}`"
          :f-id="f.id"
          :amount="f.amount"
          :child-type="f.childType"
          :inout="f.inout"
          :parent-type="f.parentType"
          :worth="f.worth"
          :type-list="typeList"
          @delete="deleteData"
          @update:child-type="updateChildType(f.id, $event)"
        />
      </tbody>
    </table>
  </div>
</template>

  <style scoped>

  </style>
