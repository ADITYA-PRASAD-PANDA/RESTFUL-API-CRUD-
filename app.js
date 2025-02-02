const express= require('express');
const mongoose= require('mongoose');
const app= express();
const bodyParser= require('body-parser');


mongoose.connect("mongodb://localhost:27017/PostMan").then(()=>{
  console.log("connected with mongodb")
}).catch((err)=>{
  console.log(err)
})


app.use(bodyParser.urlencoded({ extended:false}));
app.use(express.json())

const productSchema = new mongoose.Schema({
  name:String,
  description:String,
  price:Number,
})

const Product=new mongoose.model("Product",productSchema);//collection

//create product
app.post("/api/v1/product/new",async(req,res)=>{
  const product = await Product.create(req.body);

  res.status(200).json({
    success:true,
    product
  })
})

// read product
app.get("/api/v1/products",async(req,res)=>{
  const products = await Product.find();

res.status(200).json({success:true,products})

})

//update product
app.put("/api/v1/product/:id",async(req,res)=>{
  let product = await Product.findById(req.params.id);

  product = await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,
  useFindAndModify:false,
runValidators:true});

res.status(200).json({success:true,product})


})

//Delete product
app.delete("/api/v1/product/:id",async(req,res)=>{
  const product = await Product.findById(req.params.id);

  if(!product){
    return res.status(500).json({
      success:true,
      message:"Product not found"
    })
  }
    await product.remove();

  res.status(200).json({
  success:true,
  message:"Product deleted successfully"
})

})


app.listen(4500,()=>{
  console.log("server is working on http://localhost:4500");
})