<script setup lang="ts">
import type { avatar, IPopupState, IHistory } from '~/types/RichTypes'
import { useSound } from '@vueuse/sound'
import Calculator from '~/components/tools/Calculator.vue'
import NumberSetter from '~/components/tools/NumberSetter.vue'
import UnitSelector from '~/components/tools/UnitSelector.vue'
import { useBoardData } from '~/composables/data'
import { BOARD_GAME, STAGE } from '~/types/RichEnums'
import cashResiterSfx from '/assets/sounds/cash-register.mp3'

const { getUniqueId } = useUtils()

const calc = ref<InstanceType<typeof Calculator>>()
const calcState: IPopupState = reactive({
  show: false,
  state: '', // add, transfer
  title: '',
})

const calcPop = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const currentPos = reactive({ x: 40, y: 40 })
const startOffset = reactive({ x: 0, y: 0 })

const { style } = useDraggable(calcPop, {
  initialValue: { x: currentPos.x, y: currentPos.y },
})

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    isDragging.value = true
    startOffset.x = e.touches[0].clientX - currentPos.x
    startOffset.y = e.touches[0].clientY - currentPos.y
  }
}

function handleTouchMove(e: TouchEvent) {
  if (!isDragging.value)
    return
  e.preventDefault()

  if (e.touches.length === 1) {
    currentPos.x = e.touches[0].clientX - startOffset.x
    currentPos.y = e.touches[0].clientY - startOffset.y

    if (calcPop.value) {
      calcPop.value.style.transform = `translate(${currentPos.x}px, ${currentPos.y}px)`
    }
  }
}

function handleTouchEnd() {
  isDragging.value = false
}

function closeCalcPop() {
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
  color: 'bg-gray-500',
  budget: 500000,
  unit: '',
  useReport: false,
})

function addPlayer() {
  const revBudget = players.value[0] ? players.value[0].budget : 0

  players.value.push({
    id: `p${getUniqueId()}`,
    name: `Player${players.value.length + 1}`,
    color: 'bg-blue-400',
    budget: revBudget,
    unit: '',
    useReport: true,
  })
}

addPlayer()

function selectUnit(unit: string) {
  selectedUnit.value = unit
}
function selectColorForBank(color: string) {
  bank.value.color = color
}

function deletePlayer(player: avatar) {
  players.value = players.value.filter(a => a.id !== player.id)
}
function goStartState() {
  actors.value = actors.value.concat(bank.value, players.value)
  stage.value = STAGE.START
}

// actors 중 useReport가 true인 것만 return하는 computed
const reportActors = computed(() => {
  return actors.value.filter(a => a.useReport)
})

function dropped(from: string, to: string) {
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

function addMoney(targetedAvatar: avatar) {
  calcState.state = 'add'
  calcState.to = targetedAvatar
  calcState.title = targetedAvatar.name
  calcState.show = true
}

const histories = ref<IHistory[]>([])
const showHistory = ref(false)

function addHistory(history: Omit<IHistory, 'id' | 'timestamp'>) {
  histories.value.unshift({
    id: getUniqueId(),
    timestamp: new Date(),
    ...history,
  })

  if (histories.value.length > 20)
    histories.value = histories.value.slice(0, 20)
}

function doneUseCalc() {
  if (calc.value) {
    const amount = calc.value.getNum()
    
    if (calcState.state === 'add') {
      if (calcState.to) {
        calcState.to.budget += amount
        addHistory({
          type: amount >= 0 ? 'add' : 'withdraw',
          to: calcState.to.name,
          amount: Math.abs(amount),
        })
      }
    }
    else if (calcState.state === 'transfer') {
      if (calcState.from && calcState.to) {
        calcState.from.budget -= amount
        calcState.to.budget += amount
        addHistory({
          type: 'transfer',
          from: calcState.from.name,
          to: calcState.to.name,
          amount,
        })
      }
    }
  }

  playCashSfx()
  closeCalcPop()
}

// function adjustAmount는 avatar id와 amount를 받아서 처리하는데, id 값으로 해당 avatar를 찾은  amount를 더해 준다.
function adjustAmount({ financialId, amount }: {
  financialId: string
  amount: number
}) {
  playCashSfx()
  const avatar = actors.value.find(a => a.id === financialId)
  if (avatar) {
    avatar.budget += amount
    addHistory({
      type: 'settlement',
      to: avatar.name,
      amount: Math.abs(amount)
    })
  }
}

// 게임 상태를 추적하는 변수 추가
const isGameStarted = computed(() => stage.value === STAGE.START)

// beforeunload 핸들러 수정
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  // 게임이 시작된 상태일 때만 경고
  if (isGameStarted.value) {
    event.preventDefault()
    return '게임을 종료하시겠습니까?'
  }
}

onMounted(() => {
  // 게임 시작 후 첫 상호작용이 있을 때 이벤트 리스너 등록
  const addBeforeUnloadListener = () => {
    if (isGameStarted.value) {
      window.addEventListener('beforeunload', handleBeforeUnload)
      // 이벤트 리스너는 한 번만 등록하면 되므로 제거
      document.removeEventListener('click', addBeforeUnloadListener)
    }
  }
  
  document.addEventListener('click', addBeforeUnloadListener)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

// 라우터 이동 감지
onBeforeRouteLeave((to, from, next) => {
  if (isGameStarted.value) {
    const answer = window.confirm('게임을 종료하시겠습니까?')
    if (answer) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})
</script>

<template>
  <div class="w-full">
    <el-page-header @back="() => $router.push('/')" class="mt-2 ml-4">
      <template #content>
        <span class="text-large font-bold mr-3">부자만들기</span>
        <span v-if="stage === STAGE.START" class="text-sm text-gray-500">
          게임 진행중
        </span>
        <span v-else class="text-sm text-gray-500">
          게임 설정
        </span>
      </template>
    </el-page-header>

    <div class="mt-2">
      <template v-if="stage === STAGE.PREPARE">
        <div class="p-4">
          <h2 class="text-left text-lg">
            단위를 선택해 주세요.
          </h2>
          <UnitSelector @select="selectUnit" />
          <div class="my-2 w-full border-b-2" />
          <h2 class="text-left text-xl">
            은행
          </h2>
          <tools-color-selector :is-mono="true" :color="bank.color" @select="selectColorForBank" />
          <NumberSetter @change="(amount: number) => bank.budget = amount" />
          <div class="my-2 w-full border-b-2" />
          <h2 class="text-left text-xl">
            플레이어
          </h2>
          <div class="my-2 w-full border-b-2" />
          <div v-for="(act, idx) in players" :key="`prepare-${act.id}`" class="w-full">
            <div class="flex justify-between">
              <div class="flex items-center">
                <h2 class="mr-4 text-left text-lg">
                  플레이어 {{ idx + 1 }}
                </h2>
                <div class="relative">
                  <input v-model="act.name" type="text" class="mr-2 border p-2" placeholder="이름을 입력해 주세요.">
                  <button
                    class="absolute right-4 top-3 hover:text-red-600 active:hover:text-red-400"
                    @click="act.name = ''"
                  >
                    <div i-carbon-close-filled />
                  </button>
                </div>
                <div
                  v-for="p in preDefinedPlayers" :key="`pre-defined-namem-${act.id}-${p}`"
                  class="name-tag mx-2 h-8 flex cursor-pointer items-center rounded-xl bg-gray-200 p-2 text-center"
                  @click="act.name = p"
                >
                  {{ p }}
                </div>
              </div>
              <button class="tiny-del-btn my-1" @click="deletePlayer(act)">
                삭제
              </button>
            </div>
            <tools-color-selector :color="act.color" @select="(color: string) => act.color = color" />
            <NumberSetter :budget="act.budget" @change="(amount: number) => act.budget = amount" />
            <div class="my-2 w-full border-b-2" />
          </div>
          <div class="flex justify-center">
            <button class="tiny-btn mr-2 flex items-center" @click="addPlayer">
              추가
              <div class="i-carbon-add w-4" />
            </button>
            <button class="tiny-btn flex items-center" @click="goStartState">
              완료
              <div class="i-carbon-task-complete w-4" />
            </button>
          </div>
        </div>
      </template>
      <template v-if="stage === STAGE.START">
        <div class="w-full flex flex-wrap">
          <drag-box
            v-for="b in actors" :key="`box-${b.id}`" :box-data="b" class="mx-2" @dropped="dropped"
            @click="addMoney(b)"
          >
            <div class="text-xl font-bold">
              {{ b.name }}
            </div>
            <div class="w-full flex justify-end pr-2 pt-8">
              <span class="mr-1">{{ `${selectedUnit}` }}</span>
              <tools-count-number v-model="b.budget" />
              <span v-if="boardData?.unit" class="ml-1">{{ `${boardData.unit}` }}</span>
            </div>
          </drag-box>
        </div>
        <div v-if="calcState.show" class="fixed inset-0 z-[9999] bg-black/50" @click="closeCalcPop" />
        <div
          v-if="calcState.show"
          ref="calcPop"
          :style="style"
          class="fixed z-[10000] overflow-hidden rounded-xl bg-white shadow-2xl"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div
            class="flex touch-none items-center bg-gray-100 px-4 py-3"
          >
            <h2 class="flex-1 text-xl text-gray-800 font-bold">
              {{ calcState.title }}
            </h2>
            <button
              class="rounded-full p-2 transition-colors hover:bg-gray-200"
              @click="closeCalcPop"
            >
              <div i-carbon-close class="h-5 w-5" />
            </button>
          </div>
          <div class="w-80 p-4">
            <Calculator ref="calc" />
          </div>
          <button
            class="w-full bg-blue-500 py-4 text-white font-bold transition-colors hover:bg-blue-600"
            @click="doneUseCalc"
          >
            완료
          </button>
        </div>
        <div class="my-2 w-full border-b-2" />
        <div v-if="boardData" class="flex flex-wrap">
          <tools-financial-statement-main
            v-for="act in reportActors" :key="`financial-report-${act.id}`"
            :title="act.name" :type-list="boardData.typeList" :financial-id="act.id" class="m-2"
            @adjust="adjustAmount"
          />
        </div>
        <div class="fixed right-4 top-15 z-50">
          <button
            class="rounded-full bg-white p-3 shadow-lg hover:bg-gray-100"
            @click="showHistory = true"
          >
            <div i-carbon-document class="h-6 w-6" />
          </button>
        </div>
        <tools-financial-statement-history-viewer
          :histories="histories"
          :visible="showHistory"
          @close="showHistory = false"
        />
      </template>
    </div>
  </div>
</template>
