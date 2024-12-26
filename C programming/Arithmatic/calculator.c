#include <stdio.h>
#include "math_operations.h"

void calculator() {
    int choice, a, b;

    printf("1. Add\n");
    printf("2. Subtract\n");
    printf("3. Multiply\n");
    printf("4. Square\n");
    printf("5. Cube\n");
    printf("Enter a number: ");
    scanf("%d", &choice);

    while(1) {
        if (choice >= 1 && choice <= 3) {
            printf("Enter first integer: ");
            scanf("%d", &a);
            printf("Enter second integer: ");
            scanf("%d", &b);
            break;
        } else if (choice == 4 || choice == 5) {
            printf("Enter an integer: ");
            scanf("%d", &a);
            break;
        } else {
            printf("Please enter a number between 1 to 5.");
        } 
    }

    arithOperation op;

    switch (choice) {
        case 1: op = add;
            printf("The result is: %d\n",op(a, b)); 
            break;
        case 2: op = subtract;
            printf("The result is: %d\n", op(a, b)); 
            break;
        case 3: op = multiply;
            printf("The result is: %d\n", op(a, b)); 
            break;
        case 4: 
            printf("The result is: %d\n", SQUARE(a));
            return;
        case 5: 
            printf("The result is: %d\n", CUBE(a));
            return;
    }
}

