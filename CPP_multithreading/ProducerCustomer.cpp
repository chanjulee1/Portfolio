#include <bits/stdc++.h>
using namespace std;
#include <semaphore>
sem_t emptyCount,fullCount,mtx;
int bufferSize=5;
queue<int> q;
void producer(int id){
    for(int i=0;i<10;i++){
        sem_wait(&emptyCount);
        sem_wait(&mtx);
        q.push(i);
        sem_post(&mtx);
        sem_post(&fullCount);
        this_thread::sleep_for(chrono::milliseconds(50));
    }
}
void consumer(int id){
    for(int i=0;i<10;i++){
        sem_wait(&fullCount);
        sem_wait(&mtx);
        if(!q.empty()) q.pop();
        sem_post(&mtx);
        sem_post(&emptyCount);
        this_thread::sleep_for(chrono::milliseconds(50));
    }
}
int main(){
    sem_init(&emptyCount,0,bufferSize);
    sem_init(&fullCount,0,0);
    sem_init(&mtx,0,1);
    thread p1(producer,1),p2(producer,2);
    thread c1(consumer,1),c2(consumer,2);
    p1.join();p2.join();c1.join();c2.join();
    sem_destroy(&emptyCount);
    sem_destroy(&fullCount);
    sem_destroy(&mtx);
    return 0;
}
