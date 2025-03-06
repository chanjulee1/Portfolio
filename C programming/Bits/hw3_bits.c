#include <stdio.h>

//A function that print out the binary number of given input 
void binaryPrint(int n) {
    int binary[20];
    int i = 0;
    while (n > 0) {
                
        if (n % 2 == 0) {
            binary[i] = 0;
        } else {
            binary[i] = 1;
        }
        i += 1;
        n /= 2;
        
    }

    while (i > 0) {
        i -= 1;
        printf("%d",binary[i]);
    }
}

int main() {
    // Initialize a byte with binary value 11101100 (in hexadecimal, 0xec) <== Note, try to use a binary constant. You may need to look up how to do this if it wasn't covered in class.
    int data = 0b11101100;
    
    // Display the initial value of 'data' in binary
    printf("Initial data: ");
    binaryPrint(data);
    printf("\n");
    
    /* step 2 */

    // All problems where an nth bit is menthioned are counting the
    // 0 bit from the right side of the word (little endian)
    // Set the 3rd bit (counting from 0 where 0 is the rightmost bit!)
    data = data | 1 << 3;
    printf("After setting 3rd bit: ");
    binaryPrint(data);
    printf("\n");

    // Clear the 5th bit
    data = data & ~ (1 << 5);
    printf("After clearing 5th bit: ");
    binaryPrint(data);
    printf("\n");

    // Toggle the 7th bit
    data = data ^ 1 << 7;
    printf("After toggling 7th bit: ");
    binaryPrint(data);
    printf("\n");

    // Check and print a message if the 7th bit is set
    if(data & (1 << 7)) {
        printf("7th Bit is set");
    } else {
        printf("7th Bit is not set");
    }
    return 0;
}

