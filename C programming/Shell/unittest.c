#include <stdio.h>
#include "common.h"
#include "heap_mgr.h"

// unit test
void unit_test() {
    heap_mgr_t *hmgr = make_heap_mgr_default();
    block_mgr_t *bmgr = hmgr->bmgr;
    block_t *curr, *next;

    const int nptr = 10;
    char *ptr[nptr], *p;
    int i, j;

    for(i = 0; i < nptr; i++) {
        ptr[i] = hmgr->malloc(hmgr, 1000);
        printf("malloc ptr[%d] = %p\n", i, ptr[i]);

        curr = containerof(ptr[i], block_t, payload);
        next = bmgr->next(curr);
        ON_FALSE_EXIT(bmgr->size(curr) == 1024, "incorrect size");
        ON_FALSE_EXIT(bmgr->inuse(curr) == 1, "incorrect inuse");
        ON_FALSE_EXIT(curr->header == next->prev_footer, "inconsistent header and footer");
    }

    for(i = 1; i < nptr-2; i += 2) {
        hmgr->free(hmgr, ptr[i]);
        printf("free ptr[%d] = %p\n", i, ptr[i]);

        curr = containerof(ptr[i], block_t, payload);
        next = bmgr->next(curr);
        ON_FALSE_EXIT(bmgr->size(curr) == 1024, "incorrect size");
        ON_FALSE_EXIT(bmgr->inuse(curr) == 0, "incorrect inuse");
        ON_FALSE_EXIT(curr->header == next->prev_footer, "inconsistent header and footer");
    }
    {//last block: coalesced with the remaining free block
        hmgr->free(hmgr, ptr[i]);
        printf("free ptr[%d] = %p\n", i, ptr[i]);

        curr = containerof(ptr[i], block_t, payload);
        next = bmgr->next(curr);
        ON_FALSE_EXIT(bmgr->size(curr) == 3072, "incorrect size");
        ON_FALSE_EXIT(bmgr->inuse(curr) == 0, "incorrect inuse");
        ON_FALSE_EXIT(curr->header == next->prev_footer, "inconsistent header and footer");
    }

    i = 1;
    p = hmgr->malloc(hmgr, 1000);
    printf("p:%p == ptr[%d]:%p\n", p, i, ptr[i]);
    ON_FALSE_EXIT(p == ptr[i], "unexpected malloc");

    i = nptr - 1;
    p = hmgr->malloc(hmgr, 1500);
    printf("p:%p == ptr[%d]:%p\n", p, i, ptr[i]);
    ON_FALSE_EXIT(p == ptr[i], "unexpected malloc");
    curr = containerof(ptr[i], block_t, payload);
    next = bmgr->next(curr);
    ON_FALSE_EXIT(bmgr->size(curr) == 1520, "incorrect size");
    ON_FALSE_EXIT(bmgr->inuse(curr) == 1, "incorrect inuse");
    ON_FALSE_EXIT(curr->header == next->prev_footer, "inconsistent header and footer");

    i = 3;
    hmgr->free(hmgr, ptr[4]);
    curr = containerof(ptr[i], block_t, payload);
    next = bmgr->next(curr);
    ON_FALSE_EXIT(bmgr->size(curr) == 1024*3, "incorrect size");
    ON_FALSE_EXIT(bmgr->inuse(curr) == 0, "incorrect inuse");
    ON_FALSE_EXIT(curr->header == next->prev_footer, "inconsistent header and footer");
    
    p = hmgr->malloc(hmgr, 500);
    printf("p:%p == ptr[%d]:%p\n", p, i, ptr[i]);
    ON_FALSE_EXIT(p == ptr[i], "unexpected malloc");
    curr = containerof(ptr[i], block_t, payload);
    next = bmgr->next(curr);
    ON_FALSE_EXIT(bmgr->size(curr) == 528, "incorrect size");
    ON_FALSE_EXIT(bmgr->inuse(curr) == 1, "incorrect inuse");
    ON_FALSE_EXIT(curr->header == next->prev_footer, "inconsistent header and footer");
    ON_FALSE_EXIT(bmgr->size(next) == 1024*3 - 528, "incorrect size");
    ON_FALSE_EXIT(bmgr->inuse(next) == 0, "incorrect inuse");

    i = 3, j = 4;
    p = hmgr->malloc(hmgr, 2500);
    printf("p:%p > ptr[%d]:%p\n", p, i, ptr[i]);
    ON_FALSE_EXIT(p > ptr[i], "unexpected malloc");
    printf("p:%p < ptr[%d]:%p\n", p, j, ptr[j]);
    ON_FALSE_EXIT(p < ptr[j], "unexpected malloc");

    printf("SUCCESS!\n");
}
