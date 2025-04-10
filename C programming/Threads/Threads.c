#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <semaphore.h>
#include <unistd.h>

#define NUM_CHAIRS 5


sem_t barber_sem, customer_sem, access_seats_sem, haircut_sem, barber_done_sem;
pthread_mutex_t lock;
int num_waiting = 0;
int total_customers = 10; // total number of customers
int served_customers = 0; // used for seeing if served customers = total customers to close shop
int barber_chair = 0; //simulate if barber chair is in use
int cut_time = 2; //Haircut time
 

void* barber(void* arg) {
    while (1) {
        sem_wait(&customer_sem);

        //mutex for num waiting, served customers and barber chair
        pthread_mutex_lock(&lock);
        if (num_waiting > 0) {
            num_waiting--;
            printf("Barber: Cutting hair. Customers waiting: %d\n", num_waiting);
            barber_chair = 1;
            pthread_mutex_unlock(&lock);
            sem_post(&haircut_sem);

            // Simulate haircut
            sleep(cut_time);

            sem_post(&barber_done_sem);
            printf("Barber: Finished Haircut.\n");
            pthread_mutex_lock(&lock);
            barber_chair = 0;
            served_customers++; 
            //close shop
            if (total_customers == served_customers) {
                pthread_mutex_unlock(&lock);
                printf("Barber: All customers served, closing shop.\n");
                break; 
            }
            pthread_mutex_unlock(&lock);


        } 
         else {
            pthread_mutex_unlock(&lock);
        }

    }
     pthread_exit(NULL);
}

void* customer(void* arg) {
    pthread_mutex_lock(&lock);

        if (num_waiting == 0 && barber_chair == 0) {
        printf("Customer: Arrived, waking up the barber.\n");
    }

    if (num_waiting < NUM_CHAIRS) {
        num_waiting++;
        printf("Customer: Arrived. Customers waiting: %d\n", num_waiting);
        pthread_mutex_unlock(&lock);

        sem_post(&customer_sem);

        sem_wait(&haircut_sem);
        printf("Customer: Got a haircut.\n");

        // Acknowledge that the haircut is done
        sem_wait(&barber_done_sem);
    } else {
        printf("Customer: No seats available. Leaving.\n");
        served_customers++; 
        pthread_mutex_unlock(&lock);

    }

    pthread_exit(NULL);
}

int main() {
    pthread_t barber_thread, customer_threads[total_customers];

    sem_init(&barber_sem, 0, 0);
    sem_init(&customer_sem, 0, 0);
    sem_init(&access_seats_sem, 0, 1);
    sem_init(&haircut_sem, 0, 0);
    sem_init(&barber_done_sem, 0, 0);
    pthread_mutex_init(&lock,NULL);

    pthread_create(&barber_thread, NULL, barber, NULL);

    for (int i = 0; i < total_customers; ++i) {
        pthread_create(&customer_threads[i], NULL, customer, NULL);
        // Sleep to simulate time between customer arrivals
        int customer_interval = rand() % 2;  //customer arrival interval
        sleep(customer_interval);
    }

    pthread_join(barber_thread, NULL);

    for (int i = 0; i < total_customers; ++i) {
        pthread_join(customer_threads[i], NULL);
    }

    sem_destroy(&barber_sem);
    sem_destroy(&customer_sem);
    sem_destroy(&access_seats_sem);
    sem_destroy(&haircut_sem);
    sem_destroy(&barber_done_sem);
    pthread_mutex_destroy(&lock);

    return 0;
}

