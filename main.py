def triangle(n):
    for i in range(1, n + 1):
        print('*' * i)

n = 5
triangle(n)

def reverse_triangle(n):
    for i in range(n, 0, -1):
        print('*' * i)

n = 5  
reverse_triangle(n)