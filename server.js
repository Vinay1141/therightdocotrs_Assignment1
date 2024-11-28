const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");


app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/person')
.then(() => console.log('Mongodb connected'))
.catch(err => console.error('Mongodb connection error:', err));

const personSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  mobile: String,
});

const Person = mongoose.model("Person", personSchema);
app.get("/person", async (req, res) => {
  const people = await Person.find({});
  res.render("index", { people });
});

app.get("/person/new", (req, res) => {
  res.render("create");
});

app.post("/person", async (req, res) => {
  const { name, age, gender, mobile } = req.body;
  await Person.create({ name, age, gender, mobile });
  res.redirect("/person");
});

app.get("/person/:id/edit", async (req, res) => {
  const person = await Person.findById(req.params.id);
  res.render("edit", { person });
});

app.post("/person/:id/edit", async (req, res) => {
  const { name, age, gender, mobile } = req.body;
  await Person.findByIdAndUpdate(req.params.id, { name, age, gender, mobile });
  res.redirect("/person");
});

app.get("/person/:id/delete", async (req, res) => {
  const person = await Person.findById(req.params.id);
  res.render("delete", { person });
});

app.post("/person/:id/delete", async (req, res) => {
  await Person.findByIdAndDelete(req.params.id);
  res.redirect("/person");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
