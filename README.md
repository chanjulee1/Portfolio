Java Proxy: HTTP proxy server. Listens for client connections, forwards HTTP GET requests to web servers (e.g., www.google.com), fetches the server's responses, and sends the data back to the client

CPP Multithreading: Codes for common mutithreading problems implemented in C++
  Dining Philosophers: Uses a single semaphore (footman) limiting the number of philosophers who can attempt to pick up chopsticks simultaneously, avoiding circular wait. 

  Producer–Consumer: Uses three semaphores (emptyCount,fullCount,mtx). emptyCount tracks free slots, fullCount tracks filled slots, mtx protects the queue.

  Readers–Writers: Implements a queue semaphore q controlling order, giving writers priority when they arrive, and standard logic to lock/unlock the shared resource.

  The Cigarette Smokers: Uses semaphores for the agent and each smoker. A table mutex guards shared variables. The agent randomly picks two ingredients; the smoker with the remaining ingredient proceeds.

  Santa Claus: Uses multiple semaphores (santaSem, reindeerSem, elfSem) to signal Santa when nine reindeer or three elves gather. Reindeer and elves increment counters protected by their respective mutexes and wait for Santa’s assistance. 

  FakeSO: A local Web program for a mock stack overflow
