<script setup lang="ts">
import type { IPopupState, avatar } from '~/types'
import { BOARD_GAME, STAGE } from '~/enums'
import UnitSelector from '~/components/tools/UnitSelector.vue'
import NumberSetter from '~/components/tools/NumberSetter.vue'
import Calculator from '~/components/tools/Calculator.vue'
import { useSound } from '@vueuse/sound'
import cashResiterSfx from '/assets/sounds/cash-register.mp3'
const calc = ref<InstanceType<typeof Calculator>>()
const calcState: IPopupState = reactive({
  show: false,
  state: '', // add, transfer
  title: '',
})

const calcPop = ref<HTMLElement | null>(null)
// const { x, y, style } = useDraggable(calcPop, {
const { style } = useDraggable(calcPop, {
  initialValue: { x: 40, y: 40 },
})
const closeCalcPop = () => {
  calcState.show = false
}

const unit = useUnitStore()
const boardData = await useBoardData(BOARD_GAME.RICH)

const preDefinedPlayers = ref<string[]>([])

if (boardData) {
  unit.setUnit(boardData.unit, boardData.unitPosition)
  preDefinedPlayers.value = boardData.preDefinedPlayers
}
const { play: playCashSfx } = useSound(cashResiterSfx)
const selectedUnit = ref<string>('')
const stage = ref<STAGE>(STAGE.PREPARE)
const actors = ref<avatar[]>([])
const players = ref<avatar[]>([])

const bank = ref<avatar>({
  id: 'bank',
  name: '부자은행',
  color: '',
  budget: 0,
  unit: '',
  useReport: false,
})

const addPlayer = () => {
  const revBudget = players.value[0] ? players.value[0].budget : 0
  players.value.push({
    id: `p${getUniqueId()}`,
    name: `Player${players.value.length + 1}`,
    color: '',
    budget: revBudget,
    unit: '',
    useReport: true,
  })
}

addPlayer()

const selectUnit = (unit: string) => {
  selectedUnit.value = unit
}
const selectColorForBank = (color: string) => {
  bank.value.color = color
}

const deletePlayer = (player: avatar) => {
  players.value = players.value.filter(a => a.id !== player.id)
}
const goStartState = () => {
  actors.value = actors.value.concat(bank.value, players.value)
  stage.value = STAGE.START
}

// actors 중 useReport가 true인 것만 return하는 computed
const reportActors = computed(() => {
  return actors.value.filter(a => a.useReport)
})

const dropped = (from: string, to: string) => {
  setTimeout(() => {
    const fromAvatar = actors.value.find(b => b.id === from)
    const toAvatar = actors.value.find(b => b.id === to)
    calcState.state = 'transfer'
    if (fromAvatar && toAvatar) {
      calcState.title = `${fromAvatar.name} -> ${toAvatar.name}`
      calcState.from = fromAvatar
      calcState.to = toAvatar
      calcState.show = true
    }
  }, 100)
}

const addMoney = (targetedAvatar: avatar) => {
  calcState.state = 'add'
  calcState.to = targetedAvatar
  calcState.title = targetedAvatar.name
  calcState.show = true
}

const doneUseCalc = () => {
  if (calc.value) {
    if (calcState.state === 'add') {
      if (calcState.to)
        calcState.to.budget += calc.value.getNum()
    }
    else if (calcState.state === 'transfer') {
      if (calcState.from && calcState.to) {
        calcState.from.budget -= calc.value.getNum()
        calcState.to.budget += calc.value.getNum()
      }
    }
  }

  playCashSfx()
  closeCalcPop()
}

// function adjustAmount는 avatar id와 amount를 받아서 처리하는데, id 값으로 해당 avatar를 찾은 후 amount를 더해 준다.
const adjustAmount = ({ financialId, amount }: {
  financialId: string
  amount: number
}) => {
  const avatar = actors.value.find(a => a.id === financialId)
  if (avatar)
    avatar.budget += amount
}
</script>

<template>
  <div class="w-full">
    <div>Rich!!</div>
    <template v-if="stage === STAGE.PREPARE">
      <h2 class="text-lg text-left">
        단위를 선택해 주세요.
      </h2>
      <UnitSelector @select="selectUnit" />
      <div class="w-full my-2 border-b-2" />
      <h2 class="text-xl text-left">
        은행
      </h2>
      <tools-color-selector :is-mono="true" @select="selectColorForBank" />
      <NumberSetter @change="(amount: number) => bank.budget = amount" />
      <div class="w-full my-2 border-b-2" />
      <h2 class="text-xl text-left">
        플레이어
      </h2>
      <div class="w-full my-2 border-b-2" />
      <div v-for="(act, idx) in players" :key="`prepare-${act.id}`" class="w-full">
        <div class="flex justify-between">
          <div class="flex items-center">
            <h2 class="text-lg text-left mr-4">
              플레이어 {{ idx + 1 }}
            </h2>
            <div class="relative">
              <input v-model="act.name" type="text" class="border p-2 mr-2" placeholder="이름을 입력해 주세요.">
              <button class="absolute right-4 top-3 hover:text-red-600 active:hover:text-red-400" @click="act.name = ''">
                <div i-carbon-close-filled />
              </button>
            </div>
            <div v-for="p in preDefinedPlayers" :key="`pre-defined-namem-${act.id}-${p}`" class="mx-2 h-8 p-2 rounded-xl name-tag cursor-pointer bg-gray-200 flex items-center text-center" @click="act.name = p">
              {{ p }}
            </div>
          </div>
          <button class="tiny-del-btn my-1" @click="deletePlayer(act)">
            삭제
          </button>
        </div>
        <tools-color-selector @select="(color:string) => act.color = color" />
        <NumberSetter @change="(amount: number) => act.budget = amount" />
        <div class="w-full my-2 border-b-2" />
      </div>
      <div class="flex justify-center">
        <button class="tiny-btn flex items-center mr-2" @click="addPlayer">
          추가<div class="i-carbon-add w-4" />
        </button>
        <button class="tiny-btn flex items-center" @click="goStartState">
          완료<div class="i-carbon-task-complete w-4" />
        </button>
      </div>
    </template>
    <template v-if="stage === STAGE.START">
      <div class="w-full flex flex-wrap">
        <drag-box v-for="b in actors" :key="`box-${b.id}`" :box-data="b" class="mx-2" @dropped="dropped" @click="addMoney(b)">
          <div class="text-xl font-bold">
            {{ b.name }}
          </div>
          <div class="flex justify-end w-full pr-2 pt-8">
            <span class="mr-1">{{ `${selectedUnit}` }}</span>
            <tools-count-number v-model="b.budget" />
          </div>
        </drag-box>
      </div>
      <div v-if="calcState.show" ref="calcPop" :style="style" style="position: fixed" class="bg-slate-100">
        <div class="flex">
          <h2 class="my-1 text-xl font-bold flex-1">
            {{ calcState.title }}
          </h2>
          <div class="m-1 border-1 rounded cursor-pointer hover:bg-slate-400 active:bg-slate-600 active:text-white" @click="closeCalcPop">
            <p class="mx-2">
              X
            </p>
          </div>
        </div>
        <div class="w-64">
          <Calculator ref="calc" />
        </div>
        <button class="btn w-full mt-2 h-12" @click="doneUseCalc">
          Done
        </button>
      </div>
      <div class="w-full my-2 border-b-2" />
      <div v-if="boardData" class="flex flex-wrap">
        <tools-financial-statement-main v-for="act in reportActors" :key="`financial-report-${act.id}`" :title="act.name" :type-list="boardData.typeList" :financial-id="act.id" class="mx-2" @adjust="adjustAmount" />
      </div>
    </template>
  </div>
</template>

<route lang="yaml">
meta:
  layout: board
  </route>
