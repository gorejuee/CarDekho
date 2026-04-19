<template>
  <v-container class="py-8" style="max-width: 720px;">
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="text-h4 font-weight-bold text-primary" style="letter-spacing: -0.5px;">CarAdvisor</div>
      <div class="text-caption font-weight-medium text-uppercase text-medium-emphasis" style="letter-spacing: 3px;">
        AI-Powered Car Recommendations
      </div>
      <div class="text-subtitle-2 text-medium-emphasis mt-2">
        Answer 7 quick questions - get your perfect car shortlist
      </div>
    </div>

    <!-- Wizard Card -->
    <v-card rounded="xl" elevation="4" v-if="!showResults" style="height: 580px; display: flex; flex-direction: column; overflow: hidden;">
      <v-progress-linear
        :model-value="(step / totalSteps) * 100"
        color="primary"
        height="6"
        rounded
      />

      <v-card-text class="pa-8 pb-4" style="flex: 1; overflow-y: auto; overflow-x: hidden;">
        <div class="text-caption text-medium-emphasis mb-1">
          Step {{ step }} of {{ totalSteps }}
        </div>

        <!-- ── STEP 1: Budget ── -->
        <div v-if="step === 1">
          <div class="text-h6 font-weight-bold mb-1">What's your budget?</div>
          <div class="text-body-2 text-medium-emphasis mb-6">
            Drag to set your range (in Lakhs ₹)
          </div>
          <div class="text-center text-h5 font-weight-bold text-primary mb-4">
            ₹{{ form.budget_min }}L – ₹{{ form.budget_max }}L
          </div>
          <v-range-slider
            v-model="budgetRange"
            :min="2" :max="100" :step="1"
            color="primary" track-color="grey-lighten-2"
            thumb-label="always"
            class="mt-4"
          />
          <div class="d-flex justify-space-between text-caption text-medium-emphasis">
            <span>₹2L (Entry)</span>
            <span>₹100L+ (Luxury)</span>
          </div>
        </div>

        <!-- ── STEP 2: About You ── -->
        <div v-if="step === 2">
          <div class="text-h6 font-weight-bold mb-1">Tell us about yourself</div>
          <div class="text-body-2 text-medium-emphasis mb-6">
            This helps us match your lifestyle
          </div>
          <div class="text-subtitle-2 mb-2">Age Group</div>
          <v-row dense class="mb-4">
            <v-col v-for="a in ageGroups" :key="a.value" cols="6" sm="3">
              <v-card
                :color="form.age_group === a.value ? 'primary' : 'grey-lighten-4'"
                :variant="form.age_group === a.value ? 'elevated' : 'flat'"
                rounded="lg" class="text-center pa-3 cursor-pointer"
                @click="form.age_group = a.value"
              >
                <div class="text-h6">{{ a.icon }}</div>
                <div class="text-caption font-weight-medium mt-1"
                  :class="form.age_group === a.value ? 'text-white' : ''">
                  {{ a.label }}
                </div>
              </v-card>
            </v-col>
          </v-row>
          <div class="text-subtitle-2 mb-2">Profession</div>
          <v-select
            v-model="form.profession"
            :items="professions"
            item-title="label"
            item-value="value"
            variant="outlined"
            density="comfortable"
            rounded="lg"
            placeholder="Select your profession"
          />
          <div class="text-subtitle-2 mb-2 mt-3">Family Size</div>
          <v-row dense>
            <v-col v-for="f in familySizes" :key="f.value" cols="6" sm="3">
              <v-card
                :color="form.family_size === f.value ? 'primary' : 'grey-lighten-4'"
                :variant="form.family_size === f.value ? 'elevated' : 'flat'"
                rounded="lg" class="text-center pa-3 cursor-pointer"
                @click="form.family_size = f.value"
              >
                <div class="text-h6">{{ f.icon }}</div>
                <div class="text-caption font-weight-medium mt-1"
                  :class="form.family_size === f.value ? 'text-white' : ''">
                  {{ f.label }}
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- ── STEP 3: Primary Use ── -->
        <div v-if="step === 3">
          <div class="text-h6 font-weight-bold mb-1">How will you mainly use the car?</div>
          <div class="text-body-2 text-medium-emphasis mb-6">Pick one that fits best</div>
          <v-row dense>
            <v-col v-for="u in useCases" :key="u.value" cols="6">
              <v-card
                :color="form.primary_use === u.value ? 'primary' : 'grey-lighten-4'"
                :variant="form.primary_use === u.value ? 'elevated' : 'flat'"
                rounded="lg" class="pa-4 cursor-pointer"
                @click="form.primary_use = u.value"
                min-height="100"
              >
                <div class="text-h5 mb-1">{{ u.icon }}</div>
                <div class="text-subtitle-2 font-weight-bold"
                  :class="form.primary_use === u.value ? 'text-white' : ''">
                  {{ u.label }}
                </div>
                <div class="text-caption"
                  :class="form.primary_use === u.value ? 'text-white' : 'text-medium-emphasis'">
                  {{ u.desc }}
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- ── STEP 4: Fuel ── -->
        <div v-if="step === 4">
          <div class="text-h6 font-weight-bold mb-1">Fuel preference?</div>
          <div class="text-body-2 text-medium-emphasis mb-6">
            Not sure? Pick "No preference" and we'll decide
          </div>
          <v-row dense>
            <v-col v-for="f in fuelTypes" :key="f.value" cols="6" sm="4">
              <v-card
                :color="form.fuel === f.value ? 'secondary' : 'grey-lighten-4'"
                :variant="form.fuel === f.value ? 'elevated' : 'flat'"
                rounded="lg" class="text-center pa-4 cursor-pointer"
                @click="form.fuel = f.value"
              >
                <div class="text-h5">{{ f.icon }}</div>
                <div class="text-caption font-weight-bold mt-1"
                  :class="form.fuel === f.value ? 'text-white' : ''">
                  {{ f.label }}
                </div>
                <div class="text-caption"
                  :class="form.fuel === f.value ? 'text-white' : 'text-medium-emphasis'">
                  {{ f.hint }}
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- ── STEP 5: Car Personality ── -->
        <div v-if="step === 5">
          <div class="text-h6 font-weight-bold mb-1">What kind of car person are you?</div>
          <div class="text-body-2 text-medium-emphasis mb-6">
            Pick the vibe that matches you
          </div>
          <v-row dense>
            <v-col v-for="p in personalities" :key="p.value" cols="12" sm="6">
              <v-card
                :color="form.car_personality === p.value ? 'primary' : 'grey-lighten-4'"
                :variant="form.car_personality === p.value ? 'elevated' : 'flat'"
                rounded="lg" class="pa-4 cursor-pointer"
                @click="form.car_personality = p.value"
              >
                <div class="d-flex align-center ga-3">
                  <div class="text-h4">{{ p.icon }}</div>
                  <div>
                    <div class="text-subtitle-2 font-weight-bold"
                      :class="form.car_personality === p.value ? 'text-white' : ''">
                      {{ p.label }}
                    </div>
                    <div class="text-caption"
                      :class="form.car_personality === p.value ? 'text-white' : 'text-medium-emphasis'">
                      {{ p.desc }}
                    </div>
                  </div>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- ── STEP 6: Priorities ── -->
        <div v-if="step === 6">
          <div class="text-h6 font-weight-bold mb-1">What matters most to you?</div>
          <div class="text-body-2 text-medium-emphasis mb-6">
            Select all that apply (at least 1)
          </div>
          <v-row dense>
            <v-col v-for="p in priorityOptions" :key="p.value" cols="6" sm="4">
              <v-card
                :color="form.priorities.includes(p.value) ? 'primary' : 'grey-lighten-4'"
                :variant="form.priorities.includes(p.value) ? 'elevated' : 'flat'"
                rounded="lg" class="text-center pa-3 cursor-pointer"
                @click="togglePriority(p.value)"
              >
                <div class="text-h5">{{ p.icon }}</div>
                <div class="text-caption font-weight-bold mt-1"
                  :class="form.priorities.includes(p.value) ? 'text-white' : ''">
                  {{ p.label }}
                </div>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- ── STEP 7: Review & Submit ── -->
        <div v-if="step === 7">
          <div class="text-h6 font-weight-bold mb-1">Your profile - looks good?</div>
          <div class="text-body-2 text-medium-emphasis mb-5">
            Review and hit Find My Cars
          </div>
          <v-list density="compact" bg-color="grey-lighten-5" rounded="lg">
            <v-list-item prepend-icon="mdi-currency-inr" title="Budget">
              <template #append>
                <span class="font-weight-bold">₹{{ form.budget_min }}L – ₹{{ form.budget_max }}L</span>
              </template>
            </v-list-item>
            <v-divider />
            <v-list-item prepend-icon="mdi-account" title="Profile">
              <template #append>
                <span class="font-weight-bold text-capitalize">{{ form.age_group }} · {{ form.profession }}</span>
              </template>
            </v-list-item>
            <v-divider />
            <v-list-item prepend-icon="mdi-account-group" title="Family">
              <template #append>
                <span class="font-weight-bold text-capitalize">{{ form.family_size?.replace('_', ' ') }}</span>
              </template>
            </v-list-item>
            <v-divider />
            <v-list-item prepend-icon="mdi-road" title="Primary Use">
              <template #append>
                <span class="font-weight-bold text-capitalize">{{ form.primary_use?.replace('_', ' ') }}</span>
              </template>
            </v-list-item>
            <v-divider />
            <v-list-item prepend-icon="mdi-gas-station" title="Fuel">
              <template #append>
                <span class="font-weight-bold text-capitalize">{{ form.fuel?.replace('_', ' ') }}</span>
              </template>
            </v-list-item>
            <v-divider />
            <v-list-item prepend-icon="mdi-car-sports" title="Car Vibe">
              <template #append>
                <span class="font-weight-bold text-capitalize">{{ form.car_personality?.replace('_', ' ') }}</span>
              </template>
            </v-list-item>
            <v-divider />
            <v-list-item prepend-icon="mdi-star" title="Priorities">
              <template #append>
                <div class="d-flex flex-wrap ga-1 justify-end" style="max-width: 280px;">
                  <v-chip
                    v-for="p in form.priorities"
                    :key="p"
                    size="x-small"
                    color="primary"
                    variant="tonal"
                  >{{ p.replace('_', ' ') }}</v-chip>
                </div>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>

      <!-- Navigation buttons -->
      <v-card-actions class="px-8 pb-6 pt-4 d-flex justify-space-between flex-shrink-0" style="border-top: 1px solid #f0f0f0;">
        <v-btn
          v-if="step > 1"
          variant="text" color="primary"
          prepend-icon="mdi-arrow-left"
          @click="step--"
        >Back</v-btn>
        <v-spacer v-if="step === 1" />

        <v-btn
          v-if="step < totalSteps"
          variant="elevated" color="primary"
          append-icon="mdi-arrow-right"
          :disabled="!canProceed"
          @click="step++"
          rounded="lg"
        >Next</v-btn>

        <v-btn
          v-if="step === totalSteps"
          variant="elevated" color="secondary"
          append-icon="mdi-magnify"
          :loading="loading"
          :disabled="!canProceed"
          @click="submitWizard"
          rounded="lg"
          size="large"
        >Find My Cars</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Results -->
    <ResultsView
      v-if="showResults"
      :recommendations="recommendations"
      :total-matches="totalMatches"
      :all-matches="allMatches"
      @restart="restart"
    />

    <!-- Error -->
    <v-snackbar v-model="showError" color="error" timeout="4000">
      {{ errorMsg }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import ResultsView from './ResultsView.vue'

const step = ref(1)
const totalSteps = 7
const loading = ref(false)
const showResults = ref(false)
const recommendations = ref([])
const totalMatches = ref(0)
const allMatches = ref([])
const showError = ref(false)
const errorMsg = ref('')

const budgetRange = ref([5, 15])
const form = ref({
  budget_min: 5,
  budget_max: 15,
  age_group: '',
  profession: '',
  family_size: '',
  primary_use: '',
  fuel: '',
  car_personality: '',
  priorities: [],
})

// Keep form in sync with slider
import { watch } from 'vue'
watch(budgetRange, (val) => {
  form.value.budget_min = val[0]
  form.value.budget_max = val[1]
})

// ── Options data ──

const ageGroups = [
  { value: '18-24', label: '18–24', icon: '🎓' },
  { value: '25-35', label: '25–35', icon: '💼' },
  { value: '36-50', label: '36–50', icon: '👨‍👩‍👧' },
  { value: '50+',   label: '50+',   icon: '🧓' },
]

const professions = [
  { value: 'student',            label: '🎓 Student' },
  { value: 'software_engineer',  label: '💻 Software Engineer' },
  { value: 'business_owner',     label: '🏢 Business Owner' },
  { value: 'government_employee',label: '🏛️ Government Employee' },
  { value: 'doctor',             label: '🏥 Doctor / Healthcare' },
  { value: 'farmer',             label: '🌾 Farmer' },
  { value: 'driver_commercial',  label: '🚖 Commercial Driver' },
  { value: 'other',              label: '👤 Other' },
]

const familySizes = [
  { value: 'alone',        label: 'Just Me',     icon: '🙋' },
  { value: 'couple',       label: 'Couple',      icon: '👫' },
  { value: 'small_family', label: 'Small Family',icon: '👨‍👩‍👦' },
  { value: 'large_family', label: 'Large Family',icon: '👨‍👩‍👧‍👦' },
]

const useCases = [
  { value: 'city',          label: 'City Commute',    icon: '🏙️', desc: 'Daily office & errands' },
  { value: 'highway',       label: 'Highway Trips',   icon: '🛣️', desc: 'Long distance travel' },
  { value: 'both',          label: 'City + Highway',  icon: '🗺️', desc: 'Mix of both' },
  { value: 'offroad',       label: 'Off-Road',        icon: '⛰️', desc: 'Rough terrain & adventure' },
  { value: 'commercial',    label: 'Commercial Use',  icon: '🚐', desc: 'Taxi / business fleet' },
  { value: 'weekend',       label: 'Weekend Leisure', icon: '🌄', desc: 'Trips & road trips' },
]

const fuelTypes = [
  { value: 'petrol',       label: 'Petrol',       icon: '⛽', hint: 'Smooth & refined' },
  { value: 'diesel',       label: 'Diesel',       icon: '🛢️', hint: 'Highway torque' },
  { value: 'cng',          label: 'CNG',          icon: '🍃', hint: 'Lowest running cost' },
  { value: 'electric',     label: 'Electric',     icon: '⚡', hint: 'Future-ready' },
  { value: 'hybrid',       label: 'Hybrid',       icon: '🔋', hint: 'Best of both' },
  { value: 'no_preference',label: 'No Preference',icon: '🤷', hint: 'AI will decide' },
]

const personalities = [
  { value: 'practical',  label: 'Practical & Economical', icon: '💰', desc: 'Low cost, max value' },
  { value: 'family',     label: 'Family Safe & Spacious', icon: '🛡️', desc: 'Safety and comfort first' },
  { value: 'sporty',     label: 'Sporty & Fun',           icon: '🏎️', desc: 'Performance & style' },
  { value: 'rugged',     label: 'Rugged & Tough',         icon: '🏔️', desc: 'Built for adventure' },
  { value: 'premium',    label: 'Premium & Luxurious',    icon: '👑', desc: 'Status and comfort' },
]

const priorityOptions = [
  { value: 'mileage',        label: 'Mileage',        icon: '⛽' },
  { value: 'safety',         label: 'Safety',          icon: '🛡️' },
  { value: 'low_maintenance',label: 'Low Maintenance', icon: '🔧' },
  { value: 'boot_space',     label: 'Boot Space',      icon: '🧳' },
  { value: 'features',       label: 'Features & Tech', icon: '📱' },
  { value: 'resale_value',   label: 'Resale Value',    icon: '📈' },
  { value: 'ground_clearance',label:'Ground Clearance',icon: '🚧' },
  { value: 'comfort',        label: 'Comfort',         icon: '🛋️' },
]

// ── Validation ──

const canProceed = computed(() => {
  switch (step.value) {
    case 1: return form.value.budget_max > form.value.budget_min
    case 2: return form.value.age_group && form.value.profession && form.value.family_size
    case 3: return !!form.value.primary_use
    case 4: return !!form.value.fuel
    case 5: return !!form.value.car_personality
    case 6: return form.value.priorities.length > 0
    case 7: return true
    default: return true
  }
})

// ── Helpers ──

const togglePriority = (val) => {
  const idx = form.value.priorities.indexOf(val)
  if (idx === -1) form.value.priorities.push(val)
  else form.value.priorities.splice(idx, 1)
}

const restart = () => {
  step.value = 1
  showResults.value = false
  recommendations.value = []
  form.value = {
    budget_min: 5, budget_max: 15,
    age_group: '', profession: '', family_size: '',
    primary_use: '', fuel: '', car_personality: '',
    priorities: [],
  }
  budgetRange.value = [5, 15]
}

// ── Submit ──

const submitWizard = async () => {
  loading.value = true
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/recommend`,
      form.value
    )
    recommendations.value = data.recommendations
    totalMatches.value = data.total_matches
    allMatches.value = data.all_matches
    showResults.value = true
  } catch (err) {
    errorMsg.value = err.response?.data?.error || 'Something went wrong. Please try again.'
    showError.value = true
  } finally {
    loading.value = false
  }
}
</script>
