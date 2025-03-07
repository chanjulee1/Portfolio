
CDFLAGS=-ggdb -O0


all: app

app: app.c block.c common.c heap_mgr.c memory.c unittest.c
	gcc app.c block.c common.c heap_mgr.c memory.c unittest.c -o app

debug: app.c block.c common.c heap_mgr.c memory.c unittest.c
	gcc $(CDFLAGS) app.c block.c common.c heap_mgr.c memory.c unittest.c -o app


clean:
	rm app
