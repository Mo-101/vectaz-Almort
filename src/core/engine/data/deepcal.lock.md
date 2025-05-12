
# 🔐 DEEPCAL BASE DATA LOCK

## DO NOT DELETE OR MUTATE THIS FILE
This file declares that `deeptrack_3.json` is the **ONLY foundational data source**.
Supabase is for live updates ONLY.

If this file is missing, the app must **refuse to run analytics**.

## ENFORCED RULES
1. Base data must be loaded exclusively from `src/core/base_data/deeptrack_3.json` on boot
2. The data source must be registered as "basefile"
3. No other source can overwrite the base data once loaded
4. Updates from external sources must be appended, not replace the base data

---

Enforced via `bootApp()` and `setShipmentData()` functions, along with source registration validation.
