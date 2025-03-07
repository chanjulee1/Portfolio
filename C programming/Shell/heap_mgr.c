#include "common.h"
#include "heap_mgr.h"

//forward declarations
static void     init_heap(heap_mgr_t *self);
static block_t *extend_heap(heap_mgr_t *self, size_t size);
static block_t *coalesce(heap_mgr_t *self, block_t *curr);
static block_t *find_free_block(heap_mgr_t *self, size_t size);
static size_t   mem_aligned_size(heap_mgr_t *self, size_t size);
static void    *mem_alloc(heap_mgr_t *self, size_t size);
static void     mem_free(heap_mgr_t *self, void *ptr);

static void init_heap(heap_mgr_t *self) {
    block_mgr_t *bmgr = self->bmgr;
    memory_t *heap = self->heap;
    block_t *curr, *next;

    //initialize the first block
    curr = heap->sbrk(heap, 4*sizeof(block_hdr_t));
    curr->prev_footer = 0; //padding
    bmgr->set_header(curr, 2*sizeof(block_hdr_t), 1); //prolog
    
    //initialize the last block
    next = bmgr->next(curr);
    next->header = bmgr->hdr_make_epilog(); //epilog

    //set the block list head
    self->blist_head = curr;
}

static block_t *extend_heap(heap_mgr_t *self, size_t size) {
    block_mgr_t *bmgr = self->bmgr;
    memory_t *heap = self->heap;

    //adjust size
    if(size < self->brk_min_incr)
        size = self->brk_min_incr;
    size = self->mem_aligned_size(self, size);

    //find and update the last block
    //TODO: increase brk and get the oldbrk
    //hint: use heap->sbrk
    char *oldbrk = heap->sbrk(heap, size);

    //TODO: from the oldbrk, find the last block (its containing block)
    //hint: use containerof
    //hint: oldbrk is the address of the block's payload
    block_t *last_block = containerof(oldbrk, block_t, payload);

    //TODO: set the header of the last block
    //hint: use bmgr->set_header
    bmgr->set_header(last_block, size, 1);

    //the new last block
    //TODO: get the next block of the last block
    block_t *new_last_block = bmgr->next(last_block);

    //TODO: copy epilog to the header of the block


    //TODO: coalese the last block and return the result
    //hint: use self->coalesce
    return self->coalesce(self, last_block);


}

static block_t *coalesce(heap_mgr_t *self, block_t *curr) {
    block_mgr_t *bmgr = self->bmgr;
    block_t *prev = bmgr->prev(curr);
    block_t *next = bmgr->next(curr);

    //TODO: handle the four cases
    //hint: compute the new size and update the header
    //hint: use bmgr->set_header
    if(bmgr->inuse(prev) &&
       bmgr->inuse(next)) {

    }
    else if( bmgr->inuse(prev) &&
            !bmgr->inuse(next)) {

    }
    else if(!bmgr->inuse(prev) &&
             bmgr->inuse(next)) {

    }
    else {

    }
}

static block_t *find_free_block(heap_mgr_t *self, size_t size) {
    block_mgr_t *bmgr = self->bmgr;
    block_hdr_t epilog = bmgr->hdr_make_epilog();
    block_t *pos;

    //TODO: find and return a free block whose size is at least size
    //hint: step through the linked list of blocks using for loop
    //hint: start pos from self->blist_head
    //hint: stop when the pos' header is equal to epilog
    //hint: use bmgr->next to find the next block 


    return NULL;
}

static size_t mem_aligned_size(heap_mgr_t *self, size_t size) {
    size_t align_size = self->mem_align;
    return ((size + align_size - 1) / align_size) * align_size;
}

static void *mem_alloc(heap_mgr_t *self, size_t size) {
    block_mgr_t *bmgr = self->bmgr;
    block_t *curr;
    size_t next_size;

    size = self->mem_aligned_size(self, size + 2*sizeof(block_hdr_t));

    //TODO: find a free block larger than size or extend the heap

    //TODO: compute next_size. next_size is the size of the remaining
    //      block after split

    //TODO: set the header of the free block

    if(next_size >= 2*sizeof(block_hdr_t)) {
        //split
        //TODO: set the header of the remaining block
    }
    else {
        //no split
        ON_FALSE_EXIT(next_size == 0, "unexpected next size");
    }

    //TODO: return the address of the curr's payload
}

static void mem_free(heap_mgr_t *self, void *ptr) {
    block_mgr_t *bmgr = self->bmgr;
    block_t *curr;

    //TODO: find the block_t address of ptr
    //hint: use containerof

    //TODO: update the inuse field of curr

    //TODO: coalese
}

heap_mgr_t *make_heap_mgr_default() {
    return make_heap_mgr(1<<20/*1MB*/, 1<<12/*4KB*/);
}

heap_mgr_t *make_heap_mgr(size_t mem_size, size_t brk_min_incr) {
    heap_mgr_t *hmgr = malloc(sizeof(heap_mgr_t));

    // constants
    hmgr->mem_align    = 2*sizeof(block_hdr_t); //16
    hmgr->mem_size     = mem_size;
    hmgr->brk_min_incr = brk_min_incr; 
    hmgr->blist_head   = NULL;

    // function pointers
    hmgr->init_heap        = init_heap;
    hmgr->extend_heap      = extend_heap;
    hmgr->coalesce         = coalesce;
    hmgr->find_free_block  = find_free_block;
    hmgr->mem_aligned_size = mem_aligned_size;
    hmgr->malloc           = mem_alloc;
    hmgr->free             = mem_free;

    // related structures
    hmgr->heap = make_memory(hmgr->mem_size);
    hmgr->bmgr = make_block_mgr();
    hmgr->init_heap(hmgr);

    return hmgr;
}

