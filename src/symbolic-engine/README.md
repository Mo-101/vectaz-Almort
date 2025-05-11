
# DeepCAL Neuro-Symbolic Engine (Mostar Industries)

> Add to /src/symbolic-engine/

## Modules

- `core/decisionCore.ts`: AHP-TOPSIS + Grey computation
- `services/`: Feedback, container sizing, insight triggers
- `utils/distanceEngine.ts`: Real-world km calc
- `orchestrator/symbolicOrchestrator.ts`: Final handler

## Usage

```ts
import { runNeuroSymbolicCycle } from '@/symbolic-engine/orchestrator/symbolicOrchestrator';

const result = runNeuroSymbolicCycle({
  decisionMatrix, weights, criteriaTypes, alternatives,
  forwarders, weight: 16000, volume: 40,
  originLat: -1.2921, originLng: 36.8219,
  destLat: -17.8252, destLng: 31.0335
});
```

## Result Example

```json
{
  "topChoice": "DHL",
  "confidence": 0.84,
  "recommendedContainer": "40ft Container",
  "routeDistanceKm": 1894,
  "insights": [
    { "name": "BlueCargo", "issue": "⚠️ Delay trend detected: 34%" }
  ]
}
```
