def main() -> None:
    t = int(input())
    for _ in range(t):
        n = int(input())

        if n % 2 != 0 or n < 4:
            print(-1)
            continue

        max_crafts = n // 4

        if n % 6 == 0:
            min_crafts = n // 6
        elif n % 6 == 2:
            min_crafts = (n // 6) + 1
        elif n % 6 == 4:
            min_crafts = (n // 6) + 1

        print(min_crafts, max_crafts)


if __name__ == "__main__":
    main()
