#ifndef __BLOCK__
#define __BLOCK__

#include <stdio.h>

typedef unsigned long block_hdr_t;

typedef struct block {
    block_hdr_t prev_footer;
    block_hdr_t header;
    char     payload;        //where the payload begins
} block_t;

typedef struct block_mgr {
    //functions related to header
    int         (*hdr_inuse)(block_hdr_t hdr);
    size_t      (*hdr_size)(block_hdr_t hdr);
    block_hdr_t (*hdr_make)(size_t size, int inuse);
    block_hdr_t (*hdr_make_epilog)();

    //functions related to block
    int         (*inuse)(block_t *blk);
    size_t      (*size)(block_t *blk);
    void        (*set_header)(block_t *blk, size_t size, int inuse);
    block_t    *(*next)(block_t *blk);
    block_t    *(*prev)(block_t *blk);
} block_mgr_t;

extern block_mgr_t *make_block_mgr();

#endif
