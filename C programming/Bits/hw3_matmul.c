#include <stdio.h>

#define ROWS_A 9
#define COLS_A 8
#define ROWS_B 8
#define COLS_B 9

void matrix_multiply(int A[ROWS_A][COLS_A], int B[ROWS_B][COLS_B], int
			C[ROWS_A][COLS_B]) {
    for (int i = 0; i < ROWS_A; i++) {
        for (int j = 0; j < COLS_B; j++) {
            C[i][j] = 0; // Initialize the result matrix el
            for (int k = 0; k < COLS_A; k++) {
                C[i][j] += A[i][k] * B[k][j]; // Perform matrix multiplicat
            }

             printf("%d\t", C[i][j]);
        }
        printf("\n");
    }
}

//A function to print matrix
void matrix_print(int C[ROWS_A][COLS_B]) {
        for (int i = 0; i < ROWS_A; i++) {
        for (int j = 0; j < COLS_B; j++) {
             printf("%d\t", C[i][j]);
        }
        printf("\n");
    }
}

int main() {
    int matA[ROWS_A][COLS_A] = {
        {1, 2, 3, 4, 5, 6, 7, 8},
        {2, 3, 4, 5, 6, 7, 8, 9},
        {3, 4, 5, 6, 7, 8, 9, 1},
        {4, 5, 6, 7, 8, 9, 1, 2},
        {5, 6, 7, 8, 9, 1, 2, 3},
        {6, 7, 8, 9, 1, 2, 3, 4},
        {7, 8, 9, 1, 2, 3, 4, 5},
        {8, 9, 1, 2, 3, 4, 5, 6},
        {9, 1, 2, 3, 4, 5, 6, 7},
   };

    int matB[ROWS_B][COLS_B] = {
        {1, 2, 3, 4, 5, 6, 7, 8, 9},
        {2, 3, 4, 5, 6, 7, 8, 9, 1},
        {3, 4, 5, 6, 7, 8, 9, 1, 2},
        {4, 5, 6, 7, 8, 9, 1, 2, 3},
        {5, 6, 7, 8, 9, 1, 2, 3, 4},
        {6, 7, 8, 9, 1, 2, 3, 4, 5},
        {7, 8, 9, 1, 2, 3, 4, 5, 6},
        {8, 9, 1, 2, 3, 4, 5, 6, 7},
    };

    int matOut[ROWS_A][COLS_B];

    // Multiply matrices matA and matB
    matrix_multiply(matA, matB, matOut);

    // Print the result of the matrix multiplication
    matrix_print(matOut);

    return 0;
}
