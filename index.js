const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p1ooveo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const servicesCardCollection = client
      .db("MindBridge-Consultancy")
      .collection("services");
    const bookingsCollection = client
      .db("MindBridge-Consultancy")
      .collection("bookings");

    //get all services
    app.get("/all-services", async (req, res) => {
      const result = await servicesCardCollection.find({}).toArray();
      res.send(result);
    });

    // get my single service by id
    app.get("/all-services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await servicesCardCollection.findOne(query);
      res.send(result);
    });

    // Bookings services
    app.post("/bookings", async (req, res) => {
      const bookings = req.body;
      console.log(bookings);

      const result = await bookingsCollection.insertOne(bookings);
      res.send(result);
    });

    // Get user Bookings services by gmail
    app.get("/bookings", async (req, res) => {
      const result = await bookingsCollection.find({}).toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
