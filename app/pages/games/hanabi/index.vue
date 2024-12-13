<script setup lang="ts">
const title = '하나비'

const cardCount = ref(5)
const resetTrigger = ref(0)

function updateCardCount(count: number) {
  if (count >= 3 && count <= 5) {
    cardCount.value = count
    resetTrigger.value++ // 카드 개수가 변경될 때마다 증가
  }
}

watch(cardCount, () => {
  resetTrigger.value++ // 카드 개수가 변경될 때마다 증가
})
</script>

<template>
  <div class="w-full">
    <el-page-header @back="() => $router.push('/')" class="mt-2 ml-4">
      <template #content>
        <span class="text-large font-bold mr-3">{{ title }}</span>
      </template>
    </el-page-header>

    <div class="mt-2">
      <div class="hanabi-game">
        <div class="card-count-selector">
          <button
            v-for="count in [3, 4, 5]"
            :key="count"
            :class="{ active: cardCount === count }"
            @click="updateCardCount(count)"
          >
            {{ count }}
          </button>
        </div>
        <div class="cards-container">
          <HanabiCard
            v-for="index in cardCount"
            :key="`${index}-${resetTrigger}`"
            :index="index"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hanabi-game {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-count-selector {
  margin-bottom: 20px;
}

.card-count-selector button {
  margin: 0 5px;
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #f0f0f0;
  cursor: pointer;
}

.card-count-selector button.active {
  background-color: #007bff;
  color: white;
}

.cards-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
}
</style>