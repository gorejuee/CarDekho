# CarAdvisor :- AI-Powered Car Recommendation Engine

> Built for the CarDekho Group - Software Engineer (AI-Native) Take-Home Assignment

**Live URL:** https://car-dekho-red.vercel.app  
**Backend API:** https://cardekho-production.up.railway.app  
**GitHub:** https://github.com/gorejuee/CarDekho  
**Screen Recording:** https://www.youtube.com/watch?v=HGUiiqAbUpg

---

## What did I build and why?

CarAdvisor is a guided 7-step wizard that takes a confused car buyer from "I have no idea what to buy" to "here are my top 3 cars with reasons why."

The core insight driving the product decision: **the problem isn't lack of information, it's too much of it.** Most car buying platforms show you 200 cars and let you filter. That still leaves you overwhelmed. CarAdvisor flips this. It asks you questions first, then narrows to exactly 3 recommendations with AI-written reasoning tailored to your specific profile.

The wizard captures:
- Budget range (₹2L–₹1Cr, covering all Indian market segments)
- Personal profile (age group, profession, family size)
- Primary use case (city commute, highway, off-road, commercial, weekend)
- Fuel preference
- Car personality (practical / family / sporty / rugged / premium)
- Priorities (mileage, safety, maintenance cost, boot space, features, resale, comfort)

The backend filters a PostgreSQL database of 28 real Indian market cars across all segments (hatchbacks from ₹3.99L to luxury SUVs at ₹96.5L), then sends the filtered matches to Groq's LLaMA 3.3 70B model which picks the top 3 and explains exactly why each suits that specific buyer's profile, not a generic description.

Results are shown as ranked cards with match scores, AI-written headlines, pros/cons, and a side-by-side comparison table. Users can also view all matched cars via a bottom sheet.

---

## What did I deliberately cut?

| Cut | Why |
|---|---|
| User authentication | No value for a recommendation tool. Adds 45+ min of work for zero buyer benefit. |
| User history / saved results | Out of scope for MVP. The value is in the recommendation, not persistence of results. |
| Car images | Would require an image CDN or scraping pipeline. Not worth it in a 3-hour window. |
| Search / browse / filter UI | The whole point is to avoid this. Guided questions beat open-ended filtering. |
| Reviews and ratings from users | Real review data would require a data pipeline. Seed data covers specs well enough. |
| More than 28 cars | Quality over quantity. 28 well-described cars give Groq enough signal. 200 cars with poor descriptions would hurt recommendation quality. |
| Docker setup | Railway + Vercel deploy cleanly without it. Dockerizing would eat 30 min with no user-facing benefit. |
| TypeScript | Familiar stack, time-boxed build. JS with clear naming conventions is readable enough at this scale. |
| Tests | Would add ceremony without improving the shipped product in this time window. |

The biggest product call: **7 questions is the right number.** Fewer and the AI doesn't have enough signal to differentiate buyers. More and users drop off. Each question maps directly to a filtering or ranking dimension.

---

## Tech stack and why

| Layer | Choice | Why |
|---|---|---|
| Frontend | Vue 3 + Vuetify 3 + Vite | My primary stack. Zero ramp-up time. Vuetify gives wizard components, cards, and tables out of the box. |
| Backend | Node.js + Express 4 | Lightest possible API layer. No overhead. |
| ORM | Sequelize + PostgreSQL | Relational DB for structured car data. Sequelize handles migrations and model definition cleanly. |
| AI | Groq API (LLaMA 3.3 70B) | Fastest inference available. Free tier. JSON mode prompt gives structured output directly mappable to UI cards. |
| Backend hosting | Railway | One-click Postgres plugin + Node deploy from GitHub. No Docker needed. |
| Frontend hosting | Vercel | Vite apps deploy in 60 seconds. Zero config. |

---

## What I delegated to AI vs. did manually

### Delegated to Claude (AI)
- Initial boilerplate: Express app setup, Sequelize config, Car model schema
- Seed data: 28 cars with realistic Indian market specs across all segments and price points
- Groq prompt engineering: structured JSON output format, user profile injection
- Vue wizard component structure and Vuetify layout patterns
- ResultsView cards and comparison table markup
- Debugging Railway deployment issues (dotenv version conflict, port binding)

### Done manually / with active review
- **Product scoping**: architecture, deciding on 7 questions, which inputs matter, how they map to DB filters(AI gave options, I made the calls)
- **Filter logic design**: the 3-level fallback (fuel → seating → budget-only), AI gave a naive version, I redesigned it
- **Tech stack choice**: Vue 3 + Vuetify + Express + Groq - picked based on what I know deeply so review was fast and confident
- **UX decisions**: fixed card height so Next button doesn't jump between steps, addition of footer and its placement, header redesign, priorities chip wrapping in review step
- **Debugging with AI**: provided Railway logs to AI iteratively, interpreted the diagnosis, made the calls on what to try - dotenv@17 conflict and port mismatch resolved this way
- **Code review**: reviewed every file AI generated against my existing patterns from production work - caught issues, directed fixes, approved structure
- **Budget logic correction**: AI used `Op.between(min, max)` but had a wrong message output due to its interpretation, I corrected the wrong interpretation

### Where AI helped most
Scaffolding. The entire backend skeleton, model, and seed file that would have taken 45 minutes took 5. Vuetify component patterns. I know Vue but not every Vuetify 3 API by heart. The AI knew the exact prop names.

### Where AI got in the way
Railway deployment. The AI kept suggesting fixes confidently (add HOST variable, use 0.0.0.0, check Procfile) before correctly diagnosing the real issue: `dotenv@17` is actually `dotenvx` rebranded and it was intercepting the start command. Had to read the actual logs carefully and trace it myself.

AI definitely needs a proper decision maker to guide and give proper prompts with proper code reviews for a production ready system.

---

## If I had another 4 hours, what would I add?

**High value, low effort:**
- Car images via a simple image URL field in the DB (Unsplash or manufacturer press kit URLs)
- "Why not" explanations - tell the user which cars were filtered out and why
- Share results via URL (encode profile as query params)

**High value, more effort:**
- EMI calculator on each result card (price, down payment, tenure → monthly payment)
- Dealer locator - "find nearest showroom" link per recommendation using Google Maps
- Comparison mode - let users swap one of the top 3 with another from the matched pool
- More cars - 100+ cars with proper data would make the filtering genuinely powerful

**Architecture:**
- Add a proper migration system instead of `sync({ force: true })` for the seed endpoint
- Rate limiting on `/api/recommend` to prevent Groq API abuse
- Response caching - same profile inputs should cache the Groq response

---

## Running locally

```bash
# Clone
git clone https://github.com/gorejuee/CarDekho.git
cd CarDekho

# Backend
cd backend
cp .env.example .env   # add your DATABASE_URL and GROQ_API_KEY
npm install
node src/seed.js       # seed the database
npm run dev            # runs on http://localhost:3000

# Frontend (new terminal)
cd frontend
cp .env.example .env   # set VITE_API_URL=http://localhost:3000
npm install
npm run dev            # runs on http://localhost:5173
```

**Requirements:** Node 18+, PostgreSQL running locally

---

## Project structure

```
CarDekho/
├── frontend/                  # Vue 3 + Vuetify
│   └── src/
│       ├── components/
│       │   ├── WizardView.vue     # 7-step wizard, form state, API call
│       │   └── ResultsView.vue    # recommendation cards, comparison table
│       ├── App.vue
│       └── main.js               # Vuetify setup
└── backend/                   # Node.js + Express
    └── src/
        ├── config/
        │   └── database.js        # Sequelize + PostgreSQL connection
        ├── models/
        │   └── Car.js             # Car model (28 fields)
        ├── routes/
        │   └── recommend.js       # POST /api/recommend - filter + Groq
        ├── services/
        │   └── groq.js            # Groq API prompt + JSON parsing
        ├── seed-data.js           # 28 Indian market cars
        ├── seed.js                # local seeder script
        └── index.js              # Express app entry
```