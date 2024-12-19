#include <bits/stdc++.h>
using namespace std;
#include <semaphore>
sem_t resource,rcountMutex,q;
int readCount=0;
int sharedData=0;
void writer(int id){
    for(int i=0;i<5;i++){
        sem_wait(&q);
        sem_wait(&resource);
        sharedData++;
        sem_post(&resource);
        sem_post(&q);
        this_thread::sleep_for(chrono::milliseconds(50));
    }
}
void reader(int id){
    for(int i=0;i<5;i++){
        sem_wait(&q);
        sem_wait(&rcountMutex);
        readCount++;
        if(readCount==1) sem_wait(&resource);
        sem_post(&rcountMutex);
        sem_post(&q);
        this_thread::sleep_for(chrono::milliseconds(50));
        sem_wait(&rcountMutex);
        readCount--;
        if(readCount==0) sem_post(&resource);
        sem_post(&rcountMutex);
        this_thread::sleep_for(chrono::milliseconds(50));
    }
}
int main(){
    sem_init(&resource,0,1);
    sem_init(&rcountMutex,0,1);
    sem_init(&q,0,1);
    thread w1(writer,1),w2(writer,2),r1(reader,1),r2(reader,2),r3(reader,3);
    w1.join();w2.join();r1.join();r2.join();r3.join();
    sem_destroy(&resource);
    sem_destroy(&rcountMutex);
    sem_destroy(&q);
    return 0;
}
