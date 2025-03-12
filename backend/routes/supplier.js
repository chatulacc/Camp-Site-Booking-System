const express = require("express");


const router = express.Router();

const Supplier = require("../models/supplier");
const supplier = require("../models/supplier");




//test
router.get("/test",(req,res)=>res.send("Supplier routes working"));

router.post("/",(req,res) =>{
    Supplier.create(req.body).then(()=>res.json({msg:"Supplier added successfully"})).catch(()=>res.status(400).json({msg:"Supplier adding fail"}));
});


router.get("/" ,(req,res) =>{
    Supplier.find().then((supplier)=>res.json(supplier)).catch(()=>res.status(400).json({msg:"NO suppliers foud"}));
});

router.get("/:id" ,(req,res) =>{
    Supplier.findById(req.params.id).then((supplier)=>res.json(supplier)).catch(()=>res.status(400).json({msg:"cannot find this supplier"}));
});

router.put("/:id", (req,res)=> {
    Supplier.findByIdAndUpdate(req.params.id,req.body).then(()=>
        res.json({msg : "Upadate succefully"})).catch(()=>res.status(400).json({msg:"Update failed"}))
    ;
});

    router.delete("/:id", (req, res) => {
        Supplier.findByIdAndDelete(req.params.id)
            .then(() => {
                res.json({ msg: "Deleted Successfully" });
            })
            .catch(() => {
                res.status(400).json({ msg: "Cannot be deleted" });
            });
    
    
});

  






  
  module.exports = router;