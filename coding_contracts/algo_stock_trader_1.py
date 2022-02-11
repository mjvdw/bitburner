'''
Algorithmic Stock Trader I
You are attempting to solve a Coding Contract. You have 5 tries remaining, after which the contract will self-destruct.


You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:

150,4,102,198,113,47,18,17,161,179,162,74,187,198,164,21,167,2,29,119,41,51,90,103,94,1,3,193,102,109,46,121,146,154,24,117,39,31,179,197,112,5,112

Determine the maximum possible profit you can earn using at most one transaction (i.e. you can only buy and sell the stock once). If no profit can be made then the answer should be 0. Note that you have to buy the stock before you can sell it
'''


def calculate_answer(input):
    diffs = []
    for i in range(len(input)):
        for j in range(i+1, len(input)):
            diff = input[j] - input[i]
            diffs.append({
                "buy": input[i],
                "sell": input[j],
                "diff": diff
            })

    maxDiff = max(diffs, key=lambda x: x['diff'])
    print(maxDiff)


if __name__ == "__main__":
    input = [150, 4, 102, 198, 113, 47, 18, 17, 161, 179, 162, 74, 187, 198, 164, 21, 167, 2, 29, 119,
             41, 51, 90, 103, 94, 1, 3, 193, 102, 109, 46, 121, 146, 154, 24, 117, 39, 31, 179, 197, 112, 5, 112]
    calculate_answer(input)
