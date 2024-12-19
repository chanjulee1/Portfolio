#include <bits/stdc++.h>
using namespace std;
#include <semaphore>
sem_t agentSem, smokerSem[3], tableMutex;
int item1=-1,item2=-1;
bool onTable=false;
void agent(){
    for(int i=0;i<6;i++){
        sem_wait(&agentSem);
        sem_wait(&tableMutex);
        item1=rand()%3; item2=rand()%3;
        while(item1==item2) item2=rand()%3;
        onTable=true;
        sem_post(&tableMutex);
        for(int j=0;j<3;j++) sem_post(&smokerSem[j]);
    }
}
void smoker(int id){
    for(int i=0;i<2;i++){
        sem_wait(&smokerSem[id]);
        sem_wait(&tableMutex);
        if(onTable && item1!=id && item2!=id){
            onTable=false;
            sem_post(&agentSem);
        }
        sem_post(&tableMutex);
    }
}
int main(){
    sem_init(&agentSem,0,1);
    sem_init(&tableMutex,0,1);
    for(int i=0;i<3;i++) sem_init(&smokerSem[i],0,0);
    thread a(agent),s0(smoker,0),s1(smoker,1),s2(smoker,2);
    a.join();s0.join();s1.join();s2.join();
    sem_destroy(&agentSem);
    sem_destroy(&tableMutex);
    for(int i=0;i<3;i++) sem_destroy(&smokerSem[i]);
    return 0;
}
