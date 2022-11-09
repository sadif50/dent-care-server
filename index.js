const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mongodb URI and Client
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gh0wlz3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const run = async() => {
    try{
        const serviceCollection = client.db('dentCare').collection('services');
        const reviewCollection = client.db('dentCare').collection('reviews');

        // Get All Servicess Or Get Services By Limit
        app.get('/services', async(req, res) => {
            // get limit size from query
            const limit = req.query.limit;

            const query = {}
            const cursor = serviceCollection.find(query).sort({created_at: -1});
            let services;

            // Check limit is availabe
            if(limit){
                services = await cursor.limit(parseInt(limit)).toArray();
            }
            else {
                services = await cursor.toArray();
            }
            res.send(services);
        });

        // Get a Service by Id
        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        // Add a service to database
        app.post('/services', async(req, res) => {
            // Get data from body
            const service = req.body;
            // Create Date
            const created_at = new Date();
            // add current date with service data
            const new_service = {...service, created_at};

            const result = await serviceCollection.insertOne(new_service);
            res.send(result);
        });

        /*********************
         * *******************
         * REVIEW API
         * *******************
         ********************/

        // Get reviews by service_id
        app.get('/review/:id', async(req, res) => {
            const query = {service_id: req.params.id}

            const cursor = reviewCollection.find(query).sort({created_at: -1});
            const reviews = await cursor.toArray();

            res.send(reviews);
        });

        // Get reviews by email
        app.get('/review', async(req, res) => {
            const query = {reviewer_email: req.query.email}

            const cursor = reviewCollection.find(query).sort({created_at: -1});
            const reviews = await cursor.toArray();

            res.send(reviews);
        });

        // Add a Review to database
        app.post('/review', async(req, res) => {
            // Get data from body
            const review = req.body;
            // Create Date
            const created_at = new Date();
            // add current date with service data
            const new_review = {...review, created_at};

            const result = await reviewCollection.insertOne(new_review);
            res.send(result);
        });

    }
    finally{

    }
}
run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('Dent Care Server Running!');
})

app.listen(port, ()=>{
    console.log(`Dent Care Server Running on ${port}`);
});
