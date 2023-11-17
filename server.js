require('dotenv').config();
const express = require('express')
const app = express();
const path = require('path')
const mongoose = require('mongoose')
const ShortUrl = require('./models/ShortUrl')

app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname,'public')))
app.set("view engine","ejs");

app.get('/', async (req, res) => {
    const items = await ShortUrl.find({}).sort({ _id: -1 });
    const lastAddedItemId = items.length > 0 ? items[0]._id : null;
    await ShortUrl.deleteMany({ _id: { $ne: lastAddedItemId } });
    const updatedItems = await ShortUrl.find({}).sort({ _id: -1 });
    const lastAddedItem = updatedItems.length > 0 ? updatedItems[0] : null;

    res.render("index", { lastAddedItem });
});

app.post('/shortUrls',async(req,res)=>{
    await ShortUrl.create({full:req.body.fullUrl})
    res.redirect('/');
})

app.get('/:shortUrl/:id',async(req,res)=>{
   const shortUrl = await ShortUrl.findOne({short:`${req.params.shortUrl}/${req.params.id}`})
   if(shortUrl==null) return res.sendStatus(404)
   res.redirect(shortUrl.full)
})

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("listening");
    })
})
.catch((err)=>{
   console.log(err);
})
