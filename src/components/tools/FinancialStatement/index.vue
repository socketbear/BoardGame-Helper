<script setup lang="ts">
import type { IFinancialStatementProps } from '~/types'
interface Props extends IFinancialStatementProps {}
const { title, typeList } = defineProps<Props>()

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
