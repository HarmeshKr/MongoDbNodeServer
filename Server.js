const ImageExports=require("./MongoCode");
const express=require('express');
const cors=require('cors');
const app=new express();

app.use(express.json());

//--------------------------------------------
app.use(cors({
    origin:"http://localhost:3000",
    methods:['GET','PUT','POST','DELETE'],
    allowedHeaders:["Origin", "X-Requested-With", "Content-Type", "Accept"]
}));
//--------------------------------------------
app.use(express.static('Content'));
//-------------get image categories------------------

app.get('/categories',(req,res)=>{
    const response=ImageExports.categories();
    response.then(r=>res.json(r)).catch(e=>res.send(e.errorMessage));
});

app.listen(3031,()=>console.log('server listening on port 3031..'));