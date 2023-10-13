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

//--------------get images by categoryId-------------------------
app.get('/photos/:id',async (req,res)=>{
    try{
        const cid=parseInt(req.params.id);
        const response=await ImageExports.photographs(cid);
        res.json(response);
    }
    catch(e){
        res.send(e.errorMessage);
    }
    
});

//---------get cart photos by id array-----------------------------
app.post('/cart',async(req,res)=>{
    try{
         let photos=await ImageExports.cartPhotographs(req.body);
         res.json(photos);
    }
    catch(e){
        res.send(e.errorMessage);
    }
});
//--------------------place order--------------
app.post('/order',async(req,res)=>{
    try{
         let orderDetails=await ImageExports.placeOrder(req.body);
         res.json(orderDetails);
    }
    catch(e){
        res.send(e.errorMessage);
    }
});
//--------------------validate credentials--------------
app.post('/login',async(req,res)=>{
    try{
         let result=await ImageExports.validate(req.body);
         res.json(result);
    }
    catch(e){
        res.send(e.errorMessage);
    }
});

app.listen(3031,()=>console.log('server listening on port 3031..'));