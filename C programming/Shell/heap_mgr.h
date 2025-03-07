#ifndef __HEAP_MGR__
#define __HEAP_MGR__

#include <stdio.h>
#include "memory.h"
#include "block.h"

typedef struct heap_mgr {
    void     (*init_heap)(struct heap_mgr *self);
    block_t *(*extend_heap)(struct heap_mgr *self, size_t size);
    block_t *(*coalesce)(struct heap_mgr *self, block_t *curr);
    block_t *(*find_free_block)(struct heap_mgr *self, size_t size);
    size_t   (*mem_aligned_size)(struct heap_mgr *self, size_t size);
    void    *(*malloc)(struct heap_mgr *self, size_t size);
    void     (*free)(struct heap_mgr *self, void *ptr);

    memory_t *heap;
    block_mgr_t *bmgr;      //block manager
    block_t *blist_head;    //block list head
    size_t mem_align;
    size_t mem_size;
    size_t brk_min_incr;
} heap_mgr_t;

extern heap_mgr_t *make_heap_mgr_default();
extern heap_mgr_t *make_heap_mgr(size_t mem_size, size_t brk_min_incr);

#endif