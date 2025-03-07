#include <stdlib.h>
#include "common.h"
#include "memory.h"

static void *sbrk(memory_t *self, size_t incr) {
    char *oldbrk = self->brk;
    ON_FALSE_EXIT(incr >= 0 && self->brk + incr < self->end, "out of memory");
    self->brk += incr;
    return oldbrk;
}

memory_t *make_memory(size_t size) {
    memory_t *mem = malloc(sizeof(memory_t));
    mem->start = malloc(size);
    mem->brk = mem->start;
    mem->end = mem->start + size;
    mem->sbrk = sbrk;

    return mem;
}
