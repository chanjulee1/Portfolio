#include <bits/stdc++.h>
using namespace std;
#include <semaphore>
sem_t footman;
mutex chopsticks[5];
void dine(int id){
    for(int i=0;i<5;i++){
        sem_wait(&footman);
        chopsticks[id].lock();
        chopsticks[(id+1)%5].lock();
        this_thread::sleep_for(chrono::milliseconds(100));
        chopsticks[id].unlock();
        chopsticks[(id+1)%5].unlock();
        sem_post(&footman);
        this_thread::sleep_for(chrono::milliseconds(100));
    }
}
int main(){
    sem_init(&footman,0,4);
    thread ph[5];
    for(int i=0;i<5;i++) ph[i]=thread(dine,i);
    for(int i=0;i<5;i++) ph[i].join();
    sem_destroy(&footman);
    return 0;
}
