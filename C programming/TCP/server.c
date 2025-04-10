//echo_server.c
#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <sys/types.h>
#include "util.h"
#include <signal.h>


#define SERV_PORT   6000
#define MAXLINE     512

//Changed void to int to return 0 when terminating server
//Unlike Client which uses break to close client server will use kill(getppid(), SIGTERM) to close server
int echo(int fd) {
    while(1) {
        char sline[MAXLINE];
        char line[MAXLINE];
        //When client message is null terminate server, used for errors
        int n = readline(fd, line, MAXLINE);
        if (n == 0) {
            printf("readline error\n");
            return 0;
        }
        printf("CSE320 Client: %s", line);

        //When client types exit terminate server.
        if (strcmp(line, "exit\n") == 0) {
            printf("Client requested exit, exiting\n");
            return 0;
        }

        printf("CSE320 Server: ");
        //If input is null print message and terminate server, used for unexpected errors
        if (fgets(sline, MAXLINE, stdin) == NULL) {
            printf("Input is Null\n");
            return 0;
        }

        //Terminate both client and server when typing exit
        if (strcmp(sline, "exit\n") == 0) {
            CHKBOOLQUIT(writen(fd, sline, strlen(sline)) == strlen(sline), "writen error");
            printf("exiting\n");
            return 0;
        }

        //If input is more than 50 words print message and terminate server
        //51 because of \n when pressing enter
        int l = strlen(sline);
        if (l > 51) {
            printf("Input must be under 50 characters\n");
            return 0;
        }

        CHKBOOLQUIT(writen(fd, sline, l) == l, "writen error");
    }
    return 1;
}

int main(int argc, char **argv) {
    int sfd;
    struct sockaddr_in saddr;

    CHKBOOLQUIT( (sfd = socket(AF_INET, SOCK_STREAM, 0)) >= 0, "socket failed" );
    printf("CSE320 Server: Socket successfully created.\n");
    
    memset(&saddr, 0, sizeof(saddr));
    saddr.sin_family = AF_INET;
    saddr.sin_addr.s_addr = htonl(INADDR_ANY);
    saddr.sin_port = htons(SERV_PORT);
    CHKBOOLQUIT( bind(sfd, (struct sockaddr*)&saddr, sizeof(saddr)) >= 0, "bind failed");
    printf("CSE320 Server: Socket successfully bound.\n");
    CHKBOOLQUIT( listen(sfd, 1024) >= 0, "listen failed" );
    printf("CSE320 Server: Listening.\n");

    while(1) {
    //Added appropriate messages to appear on console during connection
        struct sockaddr_in caddr;
        int cfd;
	    unsigned int clen = sizeof(caddr);
        CHKBOOLQUIT( (cfd = accept(sfd, (struct sockaddr*) &caddr, &clen)) >= 0,
                                                                       "accept failed");
        printf("CSE320 Server: Accepting client connection\n");
        if(fork() == 0) {   //child
            close(sfd);
            printf("pid: %d, client: %s:%d\n", getpid(),
                                            inet_ntoa(caddr.sin_addr), caddr.sin_port);

            //Added extra code to close server when return 0
            if (echo(cfd) == 0) {
                close(cfd);
                //kill server
                kill(getppid(), SIGTERM);  
            }
            printf("pid: %d done\n", getpid());
            close(cfd);
            exit(0);
        }
        else 
            close(cfd);
    }
    return 0;
}

