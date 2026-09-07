# Kisan CropSlot — Arhtiya Dashboard

Front-end prototype of the commission-agent (arhtiya) side of **Kisan CropSlot**, a slot-booking, live-queue and status-tracking platform for MSP procurement centres.

Built for **Smart India Hackathon 2026**, Problem Statement **SIH26032** (Ministry of Consumer Affairs, Food & Public Distribution) — *"Farmers often face long waiting times, lack of information regarding procurement schedules, and uncertainty about procurement status."*

## Run it

No build step, no dependencies. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

To publish on GitHub Pages: push this folder to a repo, then Settings → Pages → deploy from branch root.

## Screens

| Screen | What it does |
|---|---|
| **Today's Overview** | Farmers booked with this arhtiya today, sorted by arrival status, plus live yard capacity |
| **Farmer Verification** | Token check, gross/tare weight and moisture entry — confirm only unlocks when every check is complete |
| **Assisted Registration** | Register a farmer who asked for help; farmer's own mobile number anchors the account |
| **J-Form & Payment** | Three-stage payment tracker with automatic flags against the 48-hour DBT norm |
| **Commission Summary** | Season-to-date commission at notified government rates |

## It's stateful

Actions carry across screens rather than being static mockups:

- Completing the verification checklist and confirming moves that farmer to **Weighed**, generates a J-Form number, and adds them to the payment tracker.
- Registering a farmer sends slot options; picking one adds a real row to Today's Overview with a new token.
- Stat counters, yard capacity, payment flags and commission totals all recompute from shared state.

## Design decisions worth knowing

**The arhtiya assists, never gatekeeps.** On the registration screen the farmer's own mobile number is the only highlighted field, and it anchors the account. There is no "approve farmer" action anywhere — the primary button sends slot options *to the farmer*, who chooses. A farmer can always self-register via SMS, IVR or the app without an agent.

**Crop-readiness drives the slot, not the calendar.** Registration asks when the crop will be ready to move, and only offers slots from that day onward. This directly addresses a documented failure of Punjab's 2020 e-token system, where one farmer received a token nine days after his harvester date and had to store cut wheat in the open.

**Payment flags show breaches, not just green ticks.** The tracker deliberately includes a case past the 48-hour norm with its blocking reason surfaced, because a system that only ever displays success proves nothing.

**Commission is visible and untouched.** The commission screen exists to make clear the platform records quantity and generates J-Forms; it does not change how or what the agent is paid.

## Files

```
index.html    markup for all five screens
styles.css    design tokens and layout
data.js       sample records and government rates
app.js        state, rendering and interactions
```

## Note on data

Every farmer name, token, J-Form number and figure in `data.js` is **illustrative sample data** created for demonstration. Commission rates (₹50.75/qtl wheat, ₹50.61/qtl paddy) reflect the rates notified for 2026–27; the 48-hour DBT and 72-hour J-Form payment norms referenced in the UI come from FCI and Haryana state directives respectively.
