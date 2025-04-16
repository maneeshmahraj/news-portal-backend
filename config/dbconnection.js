const mongoose=require("mongoose");

const DB_URL=process.env.DB_URL;


mongoose.connect(DB_URL ).then(()=>{
    console.log("mongodb is connected ...")
}).catch((err)=>{
    console.log("error while mongodb connection ",err)
})