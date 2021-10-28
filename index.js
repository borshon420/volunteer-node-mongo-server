const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
require('dotenv').config();
const cors = require('cors');


const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
//volunteerDbUser
//6wtLgBLh3BIebk03

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pgkyz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run(){
    try{
        await client.connect();
        const database = client.db('volunteer_network');
        const usersCollection = database.collection('users');
        const orderCollection = database.collection('orders')

        //GET API
        app.get('/users', async(req, res)=> {
            const cursor = usersCollection.find({});
            const users = await cursor.toArray();
            res.send(users);
            console.log('hitting the users')
        });

        // GET single API
        app.get('/users/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const user = await usersCollection.findOne(query);
            res.json(user)
            
        })

        //GET order API
        app.post('/orders', async(req, res)=> {
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result)
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res)=> {
    res.send('This is my volunteer server')
})

app.listen(port, ()=> {
    console.log('listing the port', port)
})