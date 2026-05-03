# CargoCraft Fleet (Task B)

In **Aerion**, CargoCraft runs transports with two craft types:

- **Type A:** 4 propulsion units each  
- **Type B:** 6 propulsion units each  

Given a total `n` units across the fleet (counts of A and B unknown), print the **minimum** and **maximum** possible number of crafts. If no combination of A and B sums to `n`, print `-1`.

Constraints: `1 ≤ t ≤ 1000`, `1 ≤ n ≤ 10¹⁸`. Python’s integers handle the upper range.

## How to run

```bash
python3 cargocraft_fleet.py
```

**From a file** (run inside `B/`, or adjust paths):

```bash
cd B && python3 cargocraft_fleet.py < input.txt
```

From the repo root:

```bash
python3 B/cargocraft_fleet.py < B/input.txt
```

## Input / output

- **Line 1:** `t` — number of test cases.  
- **Next `t` lines:** one integer `n` per line.

For each `n`:

- If impossible: print `-1`.  
- Else: print two integers `x y` — minimum crafts, then maximum crafts.

## Example

**Input**

```
4
4
7
24
998244353998244352
```

**Output**

```
1 1
-1
4 6
166374058999707392 249561088499561088
```

**Explanation (brief)**

- `n = 4`: only one Type A → `1 1`.  
- `n = 7`: cannot be formed with 4s and 6s → `-1`.  
- `n = 24`: e.g. four B only (`min = 4`), or six A only (`max = 6`) → `4 6`.  
- Last case: `n` is divisible by 6; min uses all B (`n/6`), max uses all A (`n/4`).

## Idea (implementation)

- Any feasible `n` must be **even** and at least **4** (otherwise `-1`).  
- **Maximum** crafts: pack with as many 4-unit A crafts as possible → `n // 4`.  
- **Minimum** crafts: pack with as many 6-unit B crafts as possible; adjust by `n % 6` (only remainders `0`, `2`, `4` appear for feasible even `n`).
