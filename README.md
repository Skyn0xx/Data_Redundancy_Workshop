# Data_Redundancy_Workshop
## Part A : From Local to Decentralized Computation

To run whole the code, you first have to run the "iris_model.py", and then you can run the "app.py".

```
python iris_model.py
python app.py
```

The model.json for the slashing has been reset to 1000 points each.

## Part B : Basic-eCommerce

### Structure of the project

You have 3 main folders :

- Basic_Implementation
- Synchronous_Mirroring
- Asynchronous_Replication

The Basic_Implementation only has a .json database.

The Synchronous_Mirroring has two databases, .json and .csv.  
It mirrors the database of the .json into the .csv synchronously.

The Asynchronous_Replication has two databases as well, but replication the database with a latency of 5 seconds.

<br>

### How to run

Start a Live Server for the index.html on the port 5500 to have the frontend.

To run the backend, you go in one of the three folders mentionned before, and you run the server.js with this line :

```
node server.js
```
