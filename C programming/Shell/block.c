#include <stdlib.h>
#include "block.h"

//forward declarations
static int         hdr_inuse(block_hdr_t hdr);
static size_t      hdr_size(block_hdr_t hdr);
static block_hdr_t hdr_make(size_t size, int inuse);
static block_hdr_t hdr_make_epilog();

static int         block_inuse(block_t *blk);
static size_t      block_size(block_t *blk);
static void        block_set_header(block_t *blk, size_t size, int inuse);
static block_t    *block_next(block_t *blk);
static block_t    *block_prev(block_t *blk);

// header related functions
//
static int hdr_inuse(block_hdr_t hdr) {
    return hdr & 0x1;
}

static size_t hdr_size(block_hdr_t hdr) {
    return hdr & ~0x7;
}

static block_hdr_t hdr_make(size_t size, int inuse) {
    inuse = !!inuse;    //make it either 0 or 1
    return (block_hdr_t)(size | inuse);
}

static block_hdr_t hdr_make_epilog() {
    return hdr_make(0, 1);
}

// block related functions
//
static int block_inuse(block_t *blk) {
    return hdr_inuse(blk->header);
}

static size_t block_size(block_t *blk) {
    return hdr_size(blk->header);
}

static void block_set_header(block_t *blk, size_t size, int inuse) {
    inuse = !!inuse;    //make it either 0 or 1
    //TODO: update blk's header and its next block's prev_footer
    blk->header = hdr_make(size, inuse);
    block_next(blk)->prev_footer = blk->header;

}

static block_t *block_next(block_t *blk) {
    char *ptr = (char*)blk;
    //TODO: return the next block
    char *ptr_next= ptr + block_size(blk) + sizeof(block_hdr_t);
    return (block_t*)ptr_next;
}

static block_t *block_prev(block_t *blk) {
    char *ptr = (char*)blk;
    //TODO: return the previous block
    char *ptr_prev = ptr - hdr_size(blk->prev_footer) - sizeof(block_hdr_t);
    return (block_t*)ptr_prev;
}

// block manager
//
block_mgr_t *make_block_mgr() {
    block_mgr_t *bmgr = malloc(sizeof(block_mgr_t));
    bmgr->hdr_inuse       = hdr_inuse;
    bmgr->hdr_size        = hdr_size;
    bmgr->hdr_make        = hdr_make;
    bmgr->hdr_make_epilog = hdr_make_epilog;
    bmgr->inuse           = block_inuse;
    bmgr->size            = block_size;
    bmgr->set_header      = block_set_header;
    bmgr->next            = block_next;
    bmgr->prev            = block_prev;

    return bmgr;
}
