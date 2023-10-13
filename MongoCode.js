const mongo=require('mongoclient/config');
const mongodb=require('mongodb');
const mongoclient=mongodb.MongoClient;

const URL = "mongodb://localhost:27017";

async function ValidateUser(user){
    const client=new mongoclient(URL);
    await client.connect();
    const db=client.db('PhotoGallery');
    const result=await db.collection('Customer').find({$and:[{email:{$eq:user.email}},{password:{$eq:user.password}}]}).project({_id:1}).toArray();
    return result;
}

async function Categories(){
    try{
        const client=new mongoclient(URL);
        await client.connect();
        console.log('connected to get photo categories.');
        const db=client.db('PhotoGallery');
        const result=await db.collection('Category').find({}).project({_id:0}).toArray();
        return result;
    }
    finally{}
}
async function GetPhotosByCategory(id){
    try{
    const client=new mongoclient(URL);
    await client.connect();
    const db=client.db('PhotoGallery');
    const result=db.collection('Photographs').find({categoryId:id}).project().toArray();
    return result;
    }
    finally{}
}
async function GetPhotosForCart(idArray){
    try{
        const client=new mongoclient(URL);
        await client.connect();
        const db=client.db('PhotoGallery');
        idArray=idArray.map(i=>new mongodb.ObjectId(i));
        const result=db.collection('Photographs').find({_id:{$in:idArray}}).project().toArray();
        return result;
    }
    finally{}
}
async function place_Order(details){
    try{
        const client=new mongoclient(URL);
        await client.connect();
        const db=client.db('PhotoGallery');
        
        let total=0;
        details.cart.map(p=>total+=parseInt(p.photoPrice)*parseInt(p.quantity));

        var order_date=new Date();
        var result=await db.collection('Orders').insertOne({orderDate:order_date,
            customerId:new mongodb.ObjectId(details.customerId),
        orderTotal:total});

        var id=result.insertedId;

        var orderDetails=details.cart.map(p=>{
          return{
                orderId:id.toJSON(),productId:p._id,price:p.photoPrice,quantity:p.quantity
            }});    

          result=await db.collection("OrderDetails").insertMany(orderDetails);

        var payment={ 
            orderId :id.toJSON(), 
            cardNumber:details.user.cardNumber,
            cardHolderName:details.user.cardHolderName,
            cardValidTill : `${details.user.month}-${details.user.year}`, 
            amount : total 
        }
        result=await db.collection("Payment").insertOne(payment);

        
        let cust=await db.collection("Customer").find({_id:new mongodb.ObjectId(details.customerId)}).project({_id:0,password:0}).toArray();
        return {invoiceId:result.insertedId.toJSON(),orderId:id.toJSON(),orderDate:order_date,customer:cust};
    }
    finally{}
}

module.exports= {
    categories:Categories,
    photographs:GetPhotosByCategory,
    cartPhotographs:GetPhotosForCart,
    placeOrder:place_Order,
    validate:ValidateUser
};