#ifndef __MEMORY__
#define __MEMORY__

#include <stdio.h>

typedef struct memory {
    char *start;
    char *end;
    char *brk;

    void *(*sbrk)(struct memory *self, size_t incr);
} memory_t;

extern memory_t *make_memory(size_t size);

#endif
