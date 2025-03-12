const express = require("express");
const router = express.Router();

const Camplocations = require('../models/camplocation')

router.get("/getallcamplocations", async(req, res) => {
    try {
        const camplocations = await Camplocations.find({})
        return res.json( { camplocations });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

router.post("/getcamplocationbyid", async(req, res) => {

    const camplocationid = req.body.camplocationid
    try {
        const camplocation = await Camplocations.findOne({_id : camplocationid})
        return res.json( { camplocation });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

module.exports = router;