https://github.com/chanjulee1/Portfolio

# Portfolio Repository
This repository showcases various projects that demonstrate my skills in software development and problem-solving. Below is an overview of the key projects included:

## Table of Contents
- [C Programming](#c-programming)
  - [Arithmetic](#1-arithmetic)
  - [Bit operations](#2-bit-operations)
  - [Threads (Sleeping Barber)](#3-threadssleeping-barber)
  - [Shell](#4-shell)
  - [TCP](#5-tcp)
- [Network](#network)
  - [HTTP Proxy Server](#http-proxy-server)
  - [UDP ping-pong](#udp-ping-pong)
- [C++ Multithreading](#c-multithreading)
  - [Dining Philosophers](#1-dining-philosophers)
  - [Producer–Consumer](#2-producerconsumer)
  - [Readers–Writers](#3-readerswriters)
  - [The Cigarette Smokers](#4-the-cigarette-smokers)
  - [Santa Claus](#5-santa-claus)
- [Data Science](#data-science)
  - [NYC Airbnb](#1-nyc-airbnb)
  - [Titanic](#2-titanic)
- [Web Development](#web-development)
  - [FakeSO](#fakeso)
  - [Guess5](#guess5)
  - [VitalSync](#vitalsync)
- [Machine Learning](#machine-learning)
  - [Reinforcement Learning](#1-reinforcement-learning)
  - [CNN Convolution](#2-cnn-convolution)
  - [Autoencoder](#3-autoencoder)


## C Programming
**Various excercies in C**

### 1. Arithmetic
- Various artimetic operations performed in C

### 2. Bit operations
- hw3_matmul.c: Implements matrix multiplication for two predefined matrices. It defines functions for matrix multiplication and printing the result.
- hw3_struct_union_func.c: Defines a structure for a spiking neuron network (SNN) using a union to store different data types. It includes functions to modify the neuron’s name, number, and common data.
- hw3_bits.c: Performs bitwise operations on an integer, including setting, clearing, and toggling specific bits, and prints the binary representation of the modified values.

### 3. Threads(Sleeping Barber)
- This program simulates a barbershop with one barber and multiple customers using threads. Customers either wait for a haircut or leave if all chairs are occupied. The barber serves waiting customers and closes the shop after all have been handled.

### 4. Shell
- Implements a simple shell that reads user commands, parses them, and executes them using fork() and execvp(), supporting input/output redirection (<, >) and piping (|).

### 5. TCP
- These files implement a simple client-server echo application using TCP sockets in C. The server.c file handles incoming client connections and echoes messages, while client.c connects to the server and exchanges messages based on user input. The util.c and util.h files provide utility functions for safe I/O operations and error handling used by both the client and server.


--- 

## Network
**Code for implemting client-server connections, code in Java**:

**HTTP Proxy Server**:  
- Listens for client connections and forwards HTTP GET requests to web servers (e.g., `www.google.com`).  
- Fetches the server's responses and sends the data back to the client.

  
**UDP ping-pong**:  
This is a Java-based UDP ping-pong system:

 - UDPServer.java implements a server that listens on a port, receives ping messages, and echoes them back. You added code to parse the port from arguments, display pings with a counter, and send replies.
 - Message.java defines a simple data structure holding an IP address, port, and message content.
 - PingClient.java defines a reusable client capable of sending and receiving ping messages using UDP.
 - UDPClient.java extends PingClient to send timed pings, measure round-trip times (RTT), handle timeouts, and print stats.

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

## Data Science

### 1. NYC Airbnb
- The script cleans and preprocesses NYC Airbnb data, removing invalid entries and filtering key attributes. It then analyzes price distributions, correlations, and host activity, visualizing insights using bar charts, scatter plots, heatmaps, and word clouds. Finally, it explores relationships between price, room type, and availability across different neighborhood groups.

### 2. Titanic
- The code is a machine learning pipeline designed to predict survival on the Titanic dataset from Kaggle. It begins by loading and exploring the data, followed by preprocessing steps such as handling missing values, encoding categorical variables, and feature selection. The notebook then splits the data into training and testing sets, and trains multiple models including Logistic Regression, Random Forest, and Support Vector Machines (SVM). Model performance is evaluated using accuracy scores and confusion matrices. Finally, predictions are generated on the test dataset for submission to the Kaggle competition.

---

## Web Development
**Code for websites made using MERN stack**

### FakeSO
**Mock Stack Overflow**:  
- A local web program built using the MERN stack (MongoDB, Express.js, React.js, Node.js).  
- Mimics the functionality of Stack Overflow for educational purposes.  

### Guess5
**Word Guessing Game**:  
- Developed using the MERN stack for both front-end and back-end implementation.  
- Features a user-friendly interface and interactive gameplay.  

### [VitalSync](https://github.com/chanjulee1/Portfolio/tree/main/Web%20development/VitalSync)
**Deployed Website**:
- A deployed website managing a hospital patient's care routines. 

---

## Machine Learning

### 1. Reinforcement Learning
- Reinforcement learning environment with a small grid-based Markov Decision Process (MDP), implementing value iteration, Q-learning, and SARSA for policy evaluation. It initializes transition probabilities and rewards, then runs these algorithms to compute optimal policies and prints results for comparison.

### 2. CNN Convolution
- A simple convolutional neural network (CNN) implementation in NumPy with custom convolution and pooling functions, followed by a forward pass applying three convolutional layers, ReLU activations, and pooling operations. The script processes an input image and saves filtered outputs.

### 3. Autoencoder
- This script trains an Autoencoder on the MNIST dataset using different batch sizes to analyze their impact on training loss. Training loss is tracked and plotted for different batch sizes.

If you encounter any issues or need assistance, feel free to reach out!
