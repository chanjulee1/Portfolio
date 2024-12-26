#ifndef MATH_OPERATIONS_H
#define MATH_OPERATIONS_H

typedef int (*arithOperation)(int, int);

int add(int a, int b);
int subtract(int a, int b);
int multiply(int a, int b);

#define SQUARE(x) (x * x)
#define CUBE(x) (x * x * x)

#endif 