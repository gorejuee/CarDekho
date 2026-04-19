const axios = require('axios');

async function getGroqRecommendations(userProfile, filteredCars) {
  const carList = filteredCars.map((car, i) => `
    ${i + 1}. ${car.make} ${car.model} ${car.variant}
   - Price: ₹${car.price_lakhs}L | Fuel: ${car.fuel_type} | Mileage: ${car.mileage_kmpl ?? 'N/A'} kmpl
   - Seating: ${car.seating_capacity} | Safety: ${car.safety_rating}/5 | Segment: ${car.segment}
   - Tags: ${car.use_case_tags?.join(', ')}
   - About: ${car.description}
  `).join('\n');

  const prompt = `
    You are CarAdvisor, an expert Indian car buying consultant.

    USER PROFILE:
    - Budget: ₹${userProfile.budget_min}L – ₹${userProfile.budget_max}L
    - Age group: ${userProfile.age_group}
    - Profession: ${userProfile.profession}
    - Family size: ${userProfile.family_size}
    - Primary use: ${userProfile.primary_use}
    - Fuel preference: ${userProfile.fuel}
    - Car personality: ${userProfile.car_personality}
    - Top priorities: ${userProfile.priorities?.join(', ')}

    FILTERED CARS FROM DATABASE (${filteredCars.length} matches):
    ${carList}

    TASK:
    Pick the TOP 3 cars from the list above that best match this user's profile. Consider all factors — budget, lifestyle, use case, priorities, personality, family needs.

    Respond ONLY with a valid JSON object. No explanation outside JSON. No markdown. No backticks.

    {
      "recommendations": [
        {
          "rank": 1,
          "make": "",
          "model": "",
          "variant": "",
          "price_lakhs": 0,
          "mileage_kmpl": 0,
          "fuel_type": "",
          "seating_capacity": 0,
          "safety_rating": 0,
          "segment": "",
          "match_score": 95,
          "headline": "One punchy sentence on why this is their #1 pick",
          "reason": "2-3 sentences explaining why this suits their specific profile",
          "pros": ["pro 1", "pro 2", "pro 3"],
          "cons": ["con 1", "con 2"]
        }
      ]
    }
  `;

  const response = await axios.post(
    'https://api.groq.com/openai/v1/chat/completions',
    {
      model: 'llama-3.3-70b-versatile',
      temperature: 0.4,
      max_tokens: 1500,
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const raw = response.data.choices[0].message.content.trim();
  return JSON.parse(raw);
}

module.exports = { getGroqRecommendations };