//server.js

const dotenv = require("dotenv"); // require package
dotenv.config(); // Loads the environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

mongoose.connect(process.env.MONGODB_URI);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

const Car = require("./models/car.js");
app.use(express.urlencoded({ extended: false }));


app.get("/", (req,res) => {
    res.render("index.ejs");
    
});

app.get("/cars/new", (req,res) => {
    res.render("new.ejs");
});

app.post("/cars", async (req, res) => {
    console.log(req.body);
  });

  app.get("/cars", async (req,res) => {
      try {
      const allCars = await Car.find({});
      res.render("collection.ejs", {cars: allCars });
      
    } catch (error) {
        console.log("Unable to get collection", error);
        res.status(500).send("Error loading car collection");
    }}
);

app.delete("/cars/:_id", async (req, res) =>{
    try{
        const carId = req.params._id;
        const allCars = await Car.findByIdAndDelete(carId);
        res.redirect("/cars");
    }
    catch(error) {
        console.log("Error deleting car", error);
        res.status(500).send("Error deleting car");

    } 
})

app.get("/cars/:_id/edit", async (req, res) => {
    try{
        const carId = req.params._id;
        const car = await Car.findById(carId);
        res.render("edit.ejs", { car }); 
    } catch (error) {
        console.log("error editing car", error);
        res.status(500).send("error editing car");
    }
})

app.put("/cars/:_id", async (req, res) =>{
    try{
        const carId = req.params._id;
        const { model, make, horsepower } = req.body;
        const updatedCar = await Car.findByIdAndUpdate(
            carId,
            { model, make, horsepower},
            {new: true}

        );
        res.redirect("/cars");
    } catch (error) {
        console.log("error updating car:", error);
        res.status(500).send("error updating car");

    }
})




app.post("/cars/new", async (req, res) => {
    try {
        const newCar = await Car.create(req.body);
    } catch (error) {
        console.log("Error creating car!", error);
        res.status(500).send("Error creating car");
    }
    
    res.redirect("/cars/new");
  });
  
//   app.delete("/cars/:id", async (req, res) => {
//     try {
//         const id = res.params.id;
//         const deleteCar = await Car.findByIdAndDelete(id);
//         if (!deleteCar) {
//             return res.status(404).send("Car not found!");
//         }
//     } catch (error) {
//         console.log("Error deleting car!", error);
//         res.status(500).send("Error deleting car");
//     }
//     res.redirect("/cars/new");
// }); 