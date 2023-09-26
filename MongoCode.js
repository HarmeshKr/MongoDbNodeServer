const mongo=require('mongoclient/config');
const mongodb=require('mongodb');
const mongoclient=mongodb.MongoClient;

const URL = "mongodb://localhost:27017";

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
// (async()=>{
// const res=await GetPhotosByCategory(101);
// console.log(JSON.stringify(res));
// })();

module.exports= {
    categories:Categories,
    photographs:GetPhotosByCategory
};