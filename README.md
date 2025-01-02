# Portfolio Repository

This repository showcases various projects that demonstrate my skills in software development and problem-solving. Below is an overview of the key projects included:

## Java Proxy
**HTTP Proxy Server**:  
- Listens for client connections and forwards HTTP GET requests to web servers (e.g., `www.google.com`).  
- Fetches the server's responses and sends the data back to the client.

---

## C++ Multithreading
**Codes for common multithreading problems implemented in C++:**  

### 1. Dining Philosophers
- Uses a single semaphore (`footman`) to limit the number of philosophers who can attempt to pick up chopsticks simultaneously.  
- Avoids circular wait by ensuring no deadlock occurs.  

### 2. Producer–Consumer
- Utilizes three semaphores:  
  - `emptyCount`: Tracks the number of free slots in the buffer.  
  - `fullCount`: Tracks the number of filled slots in the buffer.  
  - `mtx`: Protects the queue from simultaneous access.  

### 3. Readers–Writers
- Implements a `queue` semaphore (`q`) to control the order of access.  
- Prioritizes writers when they arrive and locks/unlocks the shared resource following standard logic.  

### 4. The Cigarette Smokers
- Uses semaphores for the agent and each smoker.  
- A `table` mutex guards shared variables.  
- The agent randomly selects two ingredients, and the smoker with the remaining ingredient proceeds.  

### 5. Santa Claus
- Employs multiple semaphores:  
  - `santaSem`: Signals Santa when help is needed.  
  - `reindeerSem` and `elfSem`: Track reindeer and elves waiting for assistance.  
- Reindeer and elves increment counters protected by mutexes and wait for Santa’s intervention.  

---

## FakeSO
**Mock Stack Overflow**:  
- A local web program built using the MERN stack (MongoDB, Express.js, React.js, Node.js).  
- Mimics the functionality of Stack Overflow for educational purposes.  

---

## Guess5
**Word Guessing Game**:  
- Developed using the MERN stack for both front-end and back-end implementation.  
- Features a user-friendly interface and interactive gameplay.  

---

If you encounter any issues or need assistance, feel free to reach out!
