data = 19
console.log(data)

const {Client} = require('pg')
const express = require('express')
const cors= require('cors')
const { connect } = require('rxjs')
const app = express()
app.use(cors({
    origin: "http://localhost:4200", 

}));
app.use(express.json());   

const connection = new Client({
    host:"localhost",                    
    user:'postgres',
    password:'huzi123',
    database:'AngularPractice', 
    
})       
connection.connect().then(()=>console.log('Database Connected'))
  
  
app.post('/pushData', (req,resp)=>{
     
    const {name,id,price,created_by, created_at,more_details,address}= req.body
    const insert_query = "INSERT INTO angularpractice (name,id,price,created_by,created_at,more_details, address) VALUES ($1,$2,$3,$4,$5,$6,$7)"
    connection.query(insert_query, [name,id,price,created_by,created_at,more_details,address], (err,result)=>{
        if (err) {    
            return resp.status(500).send(err.message);
        }
        resp.send("posted data"); 
    })  
    });
app.get('/getData', (req,resp)=>{
    const query = "SELECT * from angularpractice"
    connection.query(query, (err,result)=>{
        if(err){
            return resp.status(500).send(err.message)
        }
        resp.send(result.rows)   
    })
})
app.delete('/deleteData/:id', async (req, res) => {
    const { id } = req.params;

    try {
        console.log(`Attempting to delete ID: ${id}`); // ✅ Debugging

        const result = await connection.query('DELETE FROM angularpractice WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ "Error": true, "Message": "Record not found" });
        }

        res.json({ "Error": false, "Message": "Deleted successfully", "DeletedRow": result.rows[0] });
    } catch (error) {
        console.error("Error deleting data:", error); // ✅ Log the actual error
        res.status(500).json({ "Error": true, "Message": error.message });
    }
});

app.listen(3000,()=>{
    console.log('service running on post 3000')
})     

      