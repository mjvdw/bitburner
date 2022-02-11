'''
Algorithmic Stock Trader II
You are attempting to solve a Coding Contract. You have 10 tries remaining, after which the contract will self-destruct.


You are given the following array of stock prices (which are numbers) where the i-th element represents the stock price on day i:

138,169,156,66,44,115,50,81,96,124,106,22,107,189,191,24,132,84,61,79,169,184,2,39,35,145,132,44

Determine the maximum possible profit you can earn using as many transactions as you'd like. A transaction is defined as buying and then selling one share of the stock. Note that you cannot engage in multiple transactions at once. In other words, you must sell the stock before you buy it again.

If no profit can be made, then the answer should be 0
'''


def calculate_answer(input):
    diffs = []
    for i in range(len(input) - 1):
        diff = input[i+1] - input[i]
        if diff > 0:
            diffs.append(diff)

    print(sum(diffs))


if __name__ == "__main__":
    input = [138, 169, 156, 66, 44, 115, 50, 81, 96, 124, 106, 22, 107,
             189, 191, 24, 132, 84, 61, 79, 169, 184, 2, 39, 35, 145, 132, 44]
    calculate_answer(input)
