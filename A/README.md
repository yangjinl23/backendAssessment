# Mystic Waves (Task A)

## How to run

Requires **Python 3** (see `mystic_waves.py`).

```bash
python3 mystic_waves.py
```

**From a file** (e.g. `input.txt` in this folder):

```bash
python3 mystic_waves.py < input.txt
```

## Input / output format

1. **First line:** integer `t` — how many test cases follow (this line is **not** a pair `x n` and does **not** get its own output line).
2. **Next `t` lines:** each has two integers `x` and `n`.

For each of those `t` lines, print one line: the total energy of the alternating sequence `x, -x, x, -x, …` with `n` terms (implemented as `mystic_wave(x, n)` in the script).

So for the sample below you get **four** output lines, not five — the leading `4` only sets the loop count.

## Example (from problem statement)

**Input**

```
4
1 4
2 5
3 6
4 7
```

**Output**

```
0
2
0
4
```

## Assumptions

- Input matches the problem: `1 ≤ t ≤ 100`, `1 ≤ x, n ≤ 10`, each test line has exactly two integers.
- `mystic_wave`: if `n == 0`, result is `0`; if `n` is even, result is `0`; if `n` is odd, result is `x`.
