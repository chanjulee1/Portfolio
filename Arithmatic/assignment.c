#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>
#include "math_operations.h"

void calculator();

//Task 1
//Define enum
typedef enum {
    Sun, Mon, Tue, Wed, Thur, Fri, Sat
} Day;

void printDay(Day day) {
    switch(day) {
        case Sun:
            printf("Sunday\n");
            break;
        case Mon:
            printf("Monday\n");
            break;
        case Tue:
            printf("Tuesday\n");
            break;
        case Wed:
            printf("Wednesday\n");
            break;
        case Thur:
            printf("Thursday\n");
            break;
        case Fri:
            printf("Friday\n");
            break;
        case Sat:
            printf("Saturday\n");
            break;
        default:
            printf("Enter Correct day\n");
    }
}

//Change input string to enum
Day strToEnum(const char* input) {
    if (strcmp(input, "Sun") == 0) return Sun;
    if (strcmp(input, "Mon") == 0) return Mon;
    if (strcmp(input, "Tue") == 0) return Tue;
    if (strcmp(input, "Wed") == 0) return Wed;
    if (strcmp(input, "Thur") == 0) return Thur;
    if (strcmp(input, "Fri") == 0) return Fri;
    if (strcmp(input, "Sat") == 0) return Sat;
    return 0;
}

//Task 2
//Calculate sum and average
void sumAndAverage(int *arr, int count, double **results) {
    *results = (double *)malloc(2 * sizeof(double));

    double sum = 0;
    for (int i = 0; i < count; i++) {
        sum += arr[i];
    }

    (*results)[0] = sum;
    (*results)[1] = (*results)[0] / count;
}

//Task 3
//Declare tyedef
typedef struct {
    char manufacturer[20];
    char model[20];
    int manufactureYear;
    char color[20];
    int listPrice; 
} Automobile;

//Write auto data to file
void write_auto_array(Automobile autos[], int count) {
    FILE *file = fopen("auto.data", "wb");

    fwrite(&count, sizeof(int), 1, file);

    fwrite(autos, sizeof(Automobile), count, file);

    fclose(file);
}

//Read auto data from file
void read_auto_array(Automobile autos[]) {
    FILE *file = fopen("auto.data", "rb");

    int count;
    fread(&count, sizeof(int), 1, file);

    if (count > 100) {
        count = 100;
    }

    fread(autos, sizeof(Automobile), count, file);

    fclose(file);
}

//Task 6
//remove punctuations and transform to lowercase. 
char *wordCleaner(char *word) {
    char *dst = word;  
    char *src = word;  

    while (*src != '\0') {
        if (!ispunct(*src)) { 
            *dst = tolower(*src);  
            dst++;  
        }
        src++;  
    }
    
    *dst = '\0';  
    return word;  
}

int main() {

    printf("============");
    printf("= Task 1 =");
    printf("============\n");

    //Get input
    char input[10];
    printf("Enter a day in abbreviation (Sun, Mon, Tue, Wed, Thur, Fri, Sat): ");
    scanf("%s", input);

    //Print day
    printDay(strToEnum(input));


    printf("============");
    printf("= Task 2 =");
    printf("============\n");

    int count;

    //Write number of elements in array
    printf("Enter the number of elements in the array: ");
    scanf("%d", &count);

    //allocate memory
    int *arr = (int *)malloc(count * sizeof(int));

    //Write each element
    for (int i = 0; i < count; i++) {
        printf("There are %d elements left, enter the next element: ", count - i);
        scanf("%d", &arr[i]);
    }

    //Calcualte results
    double *results;
    sumAndAverage(arr, count, &results);

    printf("Sum of the array is %f and the the average is %f\n", results[0], results[1]);

    printf("============");
    printf("= Task 3 =");
    printf("============\n");

    //Input number of automobiles
    int n;
    printf("Enter the number of automobiles: ");
    scanf("%d", &n);

    //allocate memory
    Automobile *autos = malloc(n * sizeof(Automobile));

    //Input data for each auto
    for (int i = 0; i < n; i++) {
        printf("There are currently %d automobiles left\n" , n - i);
        printf("Manufacturer: ");
        scanf("%s", autos[i].manufacturer);
        printf("Model: ");
        scanf("%s", autos[i].model);
        printf("Manufacture Year: ");
        scanf("%d", &autos[i].manufactureYear);
        printf("Color: ");
        scanf("%s", autos[i].color);
        printf("List Price: ");
        scanf("%d", &autos[i].listPrice);
    }

    //Write to file
    write_auto_array(autos, n);

    //Check if there are more autos than 100
    int readNums;
    if (n <= 100) {
        readNums = n;
    } else {
        readNums = 100;
    }

    //Allocate memory to store read autos
    Automobile *readAutos = malloc(readNums * sizeof(Automobile));
    
    //Read Autos
    read_auto_array(readAutos);

    //Get results
    if (n > 100) {
        if (memcmp(autos, readAutos, 100 * sizeof(Automobile)) == 0) {
            printf("First 100 read data matches written data.\n");
        } else {
            printf("Read data does not match written data.\n");
        }
    } else {
        if (memcmp(autos, readAutos, n * sizeof(Automobile)) == 0) {
            printf("Read data matches written data.\n");
        } else {
            printf("Read data does not match written data.\n");
        }
    }

    printf("============");
    printf("= Task 4 and 5 =");
    printf("============\n");

    //Call calc
    calculator();

    printf("============");
    printf("= Task 6 =");
    printf("============\n");

    //Delcare Variables and data structures
    char name[100];
    char word[100];
    char words[1000][100];
    int wordFreq[1000] = {0};
    int numOfWords = 0;

    
    FILE *file;

    //Get file name
    while (1) {
        printf("Enter the name of text file: ");
        scanf("%s", name);

        file = fopen(name, "r");
        if (file == NULL) {
            printf("%s cannot be found. Please try again.\n", name);
        } else {
            break; 
        }
    }


    //Read every word
    while (fscanf(file, "%s", word) != EOF) { 
        wordCleaner(word);
    
    //Increment frequency of existing word
    int exist = 0;
    for (int i = 0; i < numOfWords; i++) {
        if (strcmp(words[i], word) == 0) {// If word is in array, increment wordFreq
            wordFreq[i]++;
            exist = 1; 
            break;  
        }
    }

    //Add new word frequency
    if (exist ==  0) {
            strcpy(words[numOfWords], word);  // Add new word
            wordFreq[numOfWords] = 1;      // Add frequency
            numOfWords++;
    }
    }
    
    //Find most frequent word
    int i = 0;
    int largest = 0;
    for (i = 1; i < numOfWords; i++) {
        if (wordFreq[i] > wordFreq[largest])
            largest = i;
    }

    printf("The most frequent word is: %s", words[largest]);

    fclose(file);

    return 0;
}
