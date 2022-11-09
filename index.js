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

        // Get All Servicess Or Get Services By Limit
        app.get('/services', async(req, res) => {
            // get limit size from query
            const limit = req.query.limit;

            const query = {}
            const cursor = serviceCollection.find(query);
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
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
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
