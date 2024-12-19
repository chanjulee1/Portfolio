#include <bits/stdc++.h>
using namespace std;
#include <semaphore>
sem_t santaSem,reindeerSem,elfSem,mutexReindeer,mutexElf;
int reindeerCount=0,elfCount=0;
int REINDEER_MAX=9,ELF_MAX=3;
void santa(){
    while(true){
        sem_wait(&santaSem);
        bool helpElves=false;
        bool deliverToys=false;
        sem_wait(&mutexReindeer);
        if(reindeerCount==REINDEER_MAX){
            reindeerCount=0;
            deliverToys=true;
        }
        sem_post(&mutexReindeer);
        sem_wait(&mutexElf);
        if(elfCount==ELF_MAX){
            elfCount=0;
            helpElves=true;
        }
        sem_post(&mutexElf);
        if(deliverToys){
            for(int i=0;i<REINDEER_MAX;i++) sem_post(&reindeerSem);
            this_thread::sleep_for(chrono::milliseconds(100));
        }
        if(helpElves){
            for(int i=0;i<ELF_MAX;i++) sem_post(&elfSem);
            this_thread::sleep_for(chrono::milliseconds(100));
        }
    }
}
void reindeer(){
    while(true){
        sem_wait(&mutexReindeer);
        reindeerCount++;
        if(reindeerCount==REINDEER_MAX) sem_post(&santaSem);
        sem_post(&mutexReindeer);
        sem_wait(&reindeerSem);
        this_thread::sleep_for(chrono::milliseconds(100));
    }
}
void elf(){
    while(true){
        sem_wait(&mutexElf);
        elfCount++;
        if(elfCount==ELF_MAX) sem_post(&santaSem);
        sem_post(&mutexElf);
        sem_wait(&elfSem);
        this_thread::sleep_for(chrono::milliseconds(100));
    }
}
int main(){
    sem_init(&santaSem,0,0);
    sem_init(&reindeerSem,0,0);
    sem_init(&elfSem,0,0);
    sem_init(&mutexReindeer,0,1);
    sem_init(&mutexElf,0,1);
    thread s(santa);
    thread r[9];
    for(int i=0;i<9;i++) r[i]=thread(reindeer);
    thread e[10];
    for(int i=0;i<10;i++) e[i]=thread(elf);
    s.join();
    for(int i=0;i<9;i++) r[i].join();
    for(int i=0;i<10;i++) e[i].join();
    return 0;
}
