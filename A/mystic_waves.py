def mystic_wave(x, n):
    if n == 0:
        return 0
    return 0 if n % 2 == 0 else x


def main():
    t = int(input().strip())
    for _ in range(t):
        x, n = map(int, input().split())
        print(mystic_wave(x, n))


if __name__ == "__main__":
    main()