const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const LogInCollection = require("./mongodb");
const port = process.env.PORT || 3000;

// Correct the spelling of "templates"
const templatePath = path.join(__dirname, "../tempelates");
const publicPath = path.join(__dirname, "../public");
const staticPath = path.join(__dirname, "../public");
const imagesPath = path.join(__dirname, "../tempelates/image");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticPath));

// Serve static files from both "templates" and "templates/images" directories
app.use(express.static(templatePath));
app.use(express.static(imagesPath));

app.set("view engine", "hbs");
app.set("views", templatePath);

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const checking = await LogInCollection.findOne({ email: req.body.email });

    if (checking) {
      res.send("User details already exist");
    } else {
      const newUser = new LogInCollection(data);
      await newUser.save();
      res.status(201).render("home", { naming: req.body.email });
    }
  } catch (error) {
    console.error("Error during signup:", error);
    res.send("Wrong inputs");
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await LogInCollection.findOne({ email: req.body.email });

    if (check) {
      // User found, now check the password
      if (check.password === req.body.password) {
        // Password is correct, render the home page
        res.status(201).render("home", { naming: req.body.email });
      } else {
        // Password is incorrect
        res.send("Incorrect password");
      }
    } else {
      // User not found
      res.send("User not found");
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});



// const express = require("express");
// const path = require("path");
// const app = express();
// const hbs = require("hbs");
// const LogInCollection = require("./mongodb");
// const { Collection } = require("mongoose");
// const port = process.env.PORT || 3000;
// app.use(express.json());

// const tempelatePath = path.join(__dirname, "../tempelates");
// const publicPath = path.join(__dirname, "../public");
// console.log(publicPath);

// app.set("view engine", "hbs");
// app.set("views", tempelatePath);
// // app.use(express.static(publicPath));
// const static_path = path.join(__dirname, "../public");
// app.use(express.static(static_path));

// app.use(express.urlencoded({ extended: false }));

// // hbs.registerPartials(partialPath)

// //default
// app.get("/", (req, res) => {
//   res.render("login");
// });

// app.get("/signup", (req, res) => {
//   res.render("signup");
// });

// // app.get('/home', (req, res) => {
// //     res.render('home')
// // })

// // app.post('/signup', async (req, res) => {

// //     // const data = new LogInCollection({
// //     //     email: req.body.email,
// //     //     password: req.body.password
// //     // })
// //     // await LogInCollection.insertMany([data])

// //     const data = {
// //         email: req.body.email,
// //         password: req.body.password
// //     }

// //     const checking = await LogInCollection.findOne({ email: req.body.email })

// //    try{
// //     if (checking.email === req.body.email && checking.password===req.body.password) {
// //         res.send("user details already exists")
// //     }
// //     else{
// //         await LogInCollection.insertMany([data])
// //     }
// //    }
// //    catch{
// //     res.send("wrong inputs")
// //    }
// //    res.status(201).render("home", {
// //         naming: req.body.email
// //     })

// //     // res.render("home")
// // })

// app.post("/signup", async (req, res) => {
//   const data = {
//     email: req.body.email,
//     password: req.body.password,
//   };

//   try {
//     const checking = await LogInCollection.findOne({ email: req.body.email });

//     if (checking) {
//       res.send("User details already exist");
//     } else {
//       const newUser = new LogInCollection(data);
//       await newUser.save();
//       res.status(201).render("home", { naming: req.body.email });
//     }
//   } catch (error) {
//     console.error("Error during signup:", error);
//     res.send("Wrong inputs");
//   }
// });

// app.post("/login", async (req, res) => {
//   try {
//     console.log(req.body);
//     const check = await LogInCollection.findOne({ email: req.body.email });

//     // console.log(check);
//     // console.log("Checking email:", req.body.email.trim().toLowerCase());
//     // const c = await LogInCollection.findOne({ email: req.body.email.trim().toLowerCase() });
//     // console.log("Database result:", c);

//     if (check) {
//       // User found, now check the password
//       if (check.password === req.body.password) {
//         // Password is correct, render the home page
//         res
//           .status(201)
//           .render("home", { naming: `${req.body.password}+${req.body.email}` });
//       } else {
//         // Password is incorrect
//         res.send("Incorrect password");
//       }
//     } else {
//       // User not found
//       res.send("User not found");
//     }
//   } catch (error) {
//     console.error("Error during login:", error);
//     res.status(500).send("Internal Server Error");
//   }
// });

// app.listen(port, () => {
//   console.log("port connected");
// });
