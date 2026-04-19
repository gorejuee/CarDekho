<template>
  <div>
    <!-- Header -->
    <div class="text-center mb-6">
      <div class="text-h5 font-weight-bold text-primary">🎯 Your Top 3 Cars</div>
      <div class="text-body-2 text-medium-emphasis mt-1">
        Matched from {{ totalMatches }} cars in our database
      </div>
    </div>

    <!-- Cards -->
     <v-row>
      <v-col v-for="car in recommendations" :key="car.rank" cols="12">
        <v-card rounded="xl" elevation="=3" :class="car.rank === 1 ? 'border-primary' : ''"
          :style="car.rank === 1 ? 'border: 2px solid #1565C0' : ''">
          <!-- Rank badge -->
          <v-card-title class="pa-5 pb-2 d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-2">
              <v-chip
                :color="car.rank === 1 ? 'secondary' : car.rank === 2 ? 'primary' : 'grey'"
                size="small" class="font-weight-bold">
                {{ car.rank === 1 ? '🥇 Best Pick' : car.rank === 2 ? '🥈 Runner Up' : '🥉 Also Great' }}
              </v-chip>
              <v-chip color="success" size="small">{{ car.match_score }}% match</v-chip>
            </div>
            <div class="text-h6 font-weight-bold text-primary">₹{{ car.price_lakhs }}L</div>
          </v-card-title>

          <v-card-text class="pa-5 pt-2">
            <!-- Car name -->
            <div class="text-h6 font-weight-bold mb-1">
              {{ car.make }} {{ car.model }}
              <span class="text-body-2 text-medium-emphasis font-weight-regular">{{ car.variant }}</span>
            </div>

            <!-- Specs row -->
            <v-row dense class="mb-3">
              <v-col cols="auto">
                <v-chip size="small" prepend-icon="mdi-gas-station" variant="tonal" color="primary">
                  {{ car.fuel_type }}
                </v-chip>
              </v-col>
              <v-col cols="auto">
                <v-chip size="small" prepend-icon="mdi-speedometer" variant="tonal" color="primary">
                  {{ car.mileage_kmpl ? car.mileage_kmpl + ' kmpl' : 'Electric' }}
                </v-chip>
              </v-col>
              <v-col cols="auto">
                <v-chip size="small" prepend-icon="mdi-account-group" variant="tonal" color="primary">
                  {{ car.seating_capacity }} seats
                </v-chip>
              </v-col>
              <v-col cols="auto">
                <v-chip size="small" prepend-icon="mdi-shield-check" variant="tonal"
                  :color="car.safety_rating >= 4 ? 'success' : car.safety_rating >= 3 ? 'warning' : 'error'">
                  {{ car.safety_rating }}/5 safety
                </v-chip>
              </v-col>
            </v-row>

            <!-- AI Headline -->
            <v-alert type="info" variant="tonal" rounded="lg" class="mb-3 text-body-2 font-weight-medium" density="compact">
              {{ car.headline }}
            </v-alert>

            <!-- AI Reason -->
            <div class="text-body-2 text-medium-emphasis mb-4">{{ car.reason }}</div>

            <!-- Pros & Cons -->
            <v-row dense>
              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-success mb-1">✅ PROS</div>
                <div v-for="pro in car.pros" :key="pro" class="text-body-2 mb-1">
                  · {{ pro }}
                </div>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="text-caption font-weight-bold text-error mb-1">⚠️ CONS</div>
                <div v-for="con in car.cons" :key="con" class="text-body-2 mb-1">
                  · {{ con }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
     </v-row>

     <!-- Comparison Table -->
    <v-card rounded="xl" elevation="2" class="mt-6">
      <v-card-title class="pa-5 pb-3 text-subtitle-1 font-weight-bold">
        📊 Side-by-Side Comparison
      </v-card-title>
      <v-table density="comfortable">
        <thead>
          <tr>
            <th>Spec</th>
            <th v-for="car in recommendations" :key="car.rank" class="text-center">
              {{ car.make }} {{ car.model }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="font-weight-medium">Price</td>
            <td v-for="car in recommendations" :key="car.rank" class="text-center">
              ₹{{ car.price_lakhs }}L
            </td>
          </tr>
          <tr>
            <td class="font-weight-medium">Fuel</td>
            <td v-for="car in recommendations" :key="car.rank" class="text-center text-capitalize">
              {{ car.fuel_type }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-medium">Mileage</td>
            <td v-for="car in recommendations" :key="car.rank" class="text-center">
              {{ car.mileage_kmpl ? car.mileage_kmpl + ' kmpl' : '—' }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-medium">Seating</td>
            <td v-for="car in recommendations" :key="car.rank" class="text-center">
              {{ car.seating_capacity }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-medium">Safety</td>
            <td v-for="car in recommendations" :key="car.rank" class="text-center">
              <v-rating :model-value="car.safety_rating" density="compact" size="x-small"
                color="warning" readonly half-increments />
            </td>
          </tr>
          <tr>
            <td class="font-weight-medium">Segment</td>
            <td v-for="car in recommendations" :key="car.rank" class="text-center text-capitalize">
              {{ car.segment }}
            </td>
          </tr>
          <tr>
            <td class="font-weight-medium">Match</td>
            <td v-for="car in recommendations" :key="car.rank" class="text-center">
              <v-chip size="small" color="success">{{ car.match_score }}%</v-chip>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- View All Matches -->
    <div class="text-center mt-4">
      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-car-multiple"
        rounded="lg"
        @click="showAllMatches = true"
      >
        View All {{ totalMatches }} Matches
      </v-btn>
    </div>

    <!-- All Matches Bottom Sheet -->
    <v-bottom-sheet v-model="showAllMatches" scrollable max-height="80vh">
      <v-card rounded="t-xl">
        <v-card-title class="pa-5 pb-3 d-flex align-center justify-space-between">
          <span class="text-subtitle-1 font-weight-bold">All {{ totalMatches }} Matches</span>
          <v-btn icon="mdi-close" variant="text" @click="showAllMatches = false" />
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <v-row>
            <v-col v-for="car in allMatches" :key="car.id" cols="12" sm="6">
              <v-card variant="outlined" rounded="lg" class="pa-3">
                <div class="d-flex justify-space-between align-start mb-1">
                  <div>
                    <div class="text-subtitle-2 font-weight-bold">{{ car.make }} {{ car.model }}</div>
                    <div class="text-caption text-medium-emphasis">{{ car.variant }}</div>
                  </div>
                  <div class="text-subtitle-2 font-weight-bold text-primary">₹{{ car.price_lakhs }}L</div>
                </div>
                <div class="d-flex flex-wrap ga-1 mt-2">
                  <v-chip size="x-small" variant="tonal" color="primary">{{ car.fuel_type }}</v-chip>
                  <v-chip size="x-small" variant="tonal" color="primary">
                    {{ car.mileage_kmpl ? car.mileage_kmpl + ' kmpl' : 'Electric' }}
                  </v-chip>
                  <v-chip size="x-small" variant="tonal" color="primary">{{ car.seating_capacity }} seats</v-chip>
                  <v-chip size="x-small" variant="tonal"
                    :color="car.safety_rating >= 4 ? 'success' : car.safety_rating >= 3 ? 'warning' : 'error'">
                    {{ car.safety_rating }}/5 ⭐
                  </v-chip>
                  <v-chip size="x-small" variant="tonal" color="grey">{{ car.segment }}</v-chip>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>

    <!-- Start Over -->
    <div class="text-center mt-8">
      <v-btn variant="outlined" color="primary" prepend-icon="mdi-refresh"
        rounded="lg" @click="$emit('restart')">
        Start Over
      </v-btn>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  recommendations: { type: Array, default: () => [] },
  totalMatches: { type: Number, default: 0 },
  allMatches: { type: Array, default: () => [] },
})
defineEmits(['restart'])

const showAllMatches = ref(false)
</script>