//echo_client.c
#include <arpa/inet.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/socket.h>
#include <sys/types.h>
#include "util.h"

#define SERV_ADDR   "127.0.0.1"
#define SERV_PORT   6000
#define MAXLINE     512

void copy(int sfd) {
    char sline[MAXLINE], rline[MAXLINE];

    //Send message
    while(1) {
        printf("CSE320 Client: ");

        //If input is null print message and terminate client
        if (fgets(sline, MAXLINE, stdin) == NULL) {
            printf("Input is Null\n");
            break;
        }

        //when exit is typed end session for both server and client
        if (strcmp(sline, "exit\n") == 0) {
            CHKBOOLQUIT(writen(sfd, sline, strlen(sline)) == strlen(sline), "writen error");
            printf("exiting\n");
            break;
        }

        //If input is more than 50 words print message and end session
        //51 because of \n when pressing enter
        int n = strlen(sline);
        if (n > 51) {
            printf("Input must be under 50 characters\n");
            break;
        }

        CHKBOOLQUIT( writen(sfd, sline, n) == n, "writen error" );

        //When server message is null terminate server, used to terminate client when server is terminated
        CHKBOOLQUIT( (n = readline(sfd, rline, MAXLINE)) > 0, "readline error" );
        rline[n] = 0;

        if (strcmp(rline, "exit\n") == 0) {
            printf("Server requested exit, exiting\n");
            break;
        }

        printf("CSE320 Server: %s", rline);
    }
    CHKBOOLQUIT( ferror(stdin) == 0, "cannot read file" );
}

int main(int argc, char **argv) {
    //Added appropriate messages to appear on console during connection
    int sfd;
    struct sockaddr_in saddr;

    CHKBOOLQUIT( (sfd = socket(AF_INET, SOCK_STREAM, 0)) >= 0,
                 "socket failed" );
    printf("CSE320 Client: Socket successfully created.\n");

    memset(&saddr, 0, sizeof(saddr));
    saddr.sin_family = AF_INET;
    saddr.sin_addr.s_addr = inet_addr(SERV_ADDR);
    saddr.sin_port = htons(SERV_PORT);

    CHKBOOLQUIT( connect(sfd, (struct sockaddr*)&saddr, sizeof(saddr)) >= 0,
                 "connect failed" );
    printf("CSE320 Client: Successfully connected to server.\n");
    printf("server: %s:%d\n", inet_ntoa(saddr.sin_addr), saddr.sin_port);

    copy(sfd);

    close(sfd);
    return 0;
}
