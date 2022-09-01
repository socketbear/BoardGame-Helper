<script setup lang="ts">
import { IN_OUT } from '~/enums'
import type { IFinancial, IFinancialStatementProps } from '~/types'
const { title, typeList } = defineProps<IFinancialStatementProps>()
const financialList: IFinancial[] = []

const num = $ref(0)

console.log('typeList :>>>', typeList, num)
</script>

<template>
  <div>
    {{ title }}
    <table>
      <thead>
        <th />
        <th>수입/지출</th>
        <th>분류</th>
        <th>항목</th>
        <th>금액</th>
        <th>투자금</th>
      </thead>
      <tbody>
        <tr>
          <td><div class="i-carbon-menu" /></td>
          <td class="text-green-800">
            수입
          </td>
          <td>부동산</td>
          <td>아파트</td>
          <td>500만원</td>
          <!-- <td>10500만원</td> -->
          <td><tools-financial-statement-currency :amount="10500" /></td>
        </tr>
        <tr v-for="f in financialList" :key="`finanlcial-line-${f.id}`">
          <td><div class="i-carbon-menu" /></td>
          <td>
            <p v-if="f.inout === IN_OUT.IN" class="text-green-800">
              수입
            </p>
            <p v-else-if="f.inout === IN_OUT.OUT" class="text-red-800">
              지출
            </p>
          </td>
          <td>{{ f.parentType }}</td>
          <td>{{ f.childType }}</td>
          <td>{{ f.amount }}</td>
          <td>{{ f.worth }}</td>
        </tr>
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
