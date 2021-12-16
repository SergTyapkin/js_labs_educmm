if __name__ == "__main__":
    matrix = []
    # print("[")
    with open("wdbc.data", "r") as file:
        for line in file:
            # print("[", end="")
            line = line.strip().split(",")
            matrix.append([])
            for val in line:
                try:
                    val = float(val)
                except:
                    if val == "M":
                        val = 1
                    else:
                        val = 0
                    # val = '"' + val + '"'
                # print(val, end=", ")
                matrix[-1].append(val)
            # print("\b\b],")
    # print("]")

    print("[")
    # for i in zip(*matrix):  # transpose
    for i in matrix:  # not transpose
        print(list(i), end=",\n")
    print("]")
