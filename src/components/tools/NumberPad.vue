<script setup>
import { computed, ref } from 'vue'
import { ElButton, ElDialog } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    default: 0,
  },
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '점수 입력',
  },
})

const emit = defineEmits(['update:modelValue', 'update:visible'])

const inputValue = ref('0')

const init = () => {
  inputValue.value = props.modelValue.toString()
}

const appendNumber = (num) => {
  if (inputValue.value === '0')
    inputValue.value = num.toString()
  else
    inputValue.value += num.toString()
}

const deleteNumber = () => {
  if (inputValue.value.length > 1)
    inputValue.value = inputValue.value.slice(0, -1)
  else
    inputValue.value = '0'
}

const clear = () => {
  inputValue.value = '0'
}

const confirm = () => {
  emit('update:modelValue', Number(inputValue.value))
  emit('update:visible', false)
}

const close = () => {
  emit('update:visible', false)
}

const dialogVisible = computed({
  get: () => props.visible,
  set: value => emit('update:visible', value),
})
</script>

<template>
  <ElDialog
    v-model="dialogVisible"
    :title="title"
    width="320px"
    :close-on-click-modal="false"
    @open="init"
  >
    <div class="number-pad">
      <div class="display">
        {{ inputValue }}
      </div>

      <div class="keypad">
        <ElButton class="key" @click="appendNumber(1)">
          1
        </ElButton>
        <ElButton class="key" @click="appendNumber(2)">
          2
        </ElButton>
        <ElButton class="key" @click="appendNumber(3)">
          3
        </ElButton>
        <ElButton class="key" @click="appendNumber(4)">
          4
        </ElButton>
        <ElButton class="key" @click="appendNumber(5)">
          5
        </ElButton>
        <ElButton class="key" @click="appendNumber(6)">
          6
        </ElButton>
        <ElButton class="key" @click="appendNumber(7)">
          7
        </ElButton>
        <ElButton class="key" @click="appendNumber(8)">
          8
        </ElButton>
        <ElButton class="key" @click="appendNumber(9)">
          9
        </ElButton>
        <ElButton class="key" @click="clear">
          C
        </ElButton>
        <ElButton class="key" @click="appendNumber(0)">
          0
        </ElButton>
        <ElButton class="key" @click="deleteNumber">
          ←
        </ElButton>
      </div>

      <div class="actions">
        <ElButton type="primary" @click="confirm">
          확인
        </ElButton>
        <ElButton @click="close">
          취소
        </ElButton>
      </div>
    </div>
  </ElDialog>
</template>

<style scoped>
.number-pad {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.display {
  padding: 16px;
  text-align: right;
  font-size: 48px;
  font-weight: 400;
  color: var(--el-text-color-primary);
}

.keypad {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  justify-items: center;
}

.key {
  width: 60px;
  height: 60px;
  font-size: 24px;
  border: none;
  border-radius: 50%;
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  transition: all 0.2s ease;
  justify-self: center;
  display: grid;
  place-items: center;
  padding: 0 !important;
  margin: 0 !important;
  line-height: 1;
}

.key:hover {
  background-color: var(--el-fill-color);
  transform: scale(1.05);
}

.key:active {
  transform: scale(0.95);
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}

.actions .el-button {
  padding: 12px;
  font-size: 16px;
  border-radius: 25px;
  height: 45px;
}

.actions .el-button--primary {
  background-color: #007AFF;
  border-color: #007AFF;
}

.actions .el-button--default {
  background-color: var(--el-fill-color-light);
  border: none;
}

.key :deep(span) {
  margin: 0;
  padding: 0;
}
</style>
