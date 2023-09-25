const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const Auth = require("../models/Auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const welcomeLayout = "../views/layouts/welcome"; 




// handle errors
const handleErrors = (err) => { 
    console.log(err.message, err.code);
    let errors = { email: "", password: ""};
    
    // incorrect email message
    if(err.message === "Incorrect email") {
        errors.email = "that email is not registered"; 
    }
    
    // incorrect password message
    if(err.message === "Incorrect password") {
        errors.password = "that password is not valid";
    }

    // duplicate error code 
    if(err.code === 11000) {
        errors.email = "email is already registered";
        return errors;  
    } 

    // validation errors
    if (err.message.includes("Auth validation failed")) {
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        });
    }

    return errors;
}


const requireAuth = (req,res, next) => {
    const token = req.cookies.jwt;

    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, "hive point secret", (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect("/login")
            } else {
                console.log(decodedToken);
                next();
            }
        })
    } else {
        res.redirect("/login");
    }
}

// routes
router.get("/", (req,res) => {
   res.render("home",  { 
    title: "Hive Point", currentRoute: "/home", layout: welcomeLayout })
});

router.get("/blog", requireAuth, async (req,res) => {
    try {
        const locals = {
            title: "Hive Blog",
            description: "Simple Blog created with NodeJs, Express & MongoDb."
        }

        let perPage = 6;
        let page = req.query.page || 1;

        const data = await Post.aggregate([ { $sort: { updatedAt: -1 } }])
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.count();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);


        res.render("blog", {
            locals, 
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: "/blog"
            });
    } catch(error) {
        console.log(error);
    }
});


router.get( "/post/:id", async (req, res) => {
    try {
    
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });


    const locals = {
        title: data.title,
        description: "Simple Blog ceated with NodeJs, Express & MongoDB",
        currentRoute: `/post/${slug}`
    }
    res.render("post", { locals, data, currentRoute: `/post/${slug}` });
    } catch (error) {
        console.log(error);
    }
});
  


  


router.post( "/search", async (req, res) => {
    try {
    const locals = {
        title: "Search",
        description: "Simple Blog ceated with NodeJs, Express & MongoDB",
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-z0-9]/g, "")

    const data = await Post.find({
        $or : [
            { title: { $regex: new RegExp(searchNoSpecialChar, "i") }},
            { body: { $regex: new RegExp(searchNoSpecialChar, "i") }}  
        ]
    });

    res.render("search", {
        data,
        locals,
        currentRoute: `/post/${searchNoSpecialChar}`
    });


    } catch (error) {
        console.log(error);
    }
});
  


router.get("/about", (req,res) => {
    res.render("about", {
        currentRoute: "/about", title: "About"
    });
});

router.get("/contact", (req,res) => {
    res.render("contact", {
        currentRoute: "/contact", title: "Contact"
    });
});

const maxAge = 3 * 24 * 60 *60;
const createToken = (id) => {
    return jwt.sign({ id }, "hive point secret", {
        expiresIn: maxAge
    });
}

router.get("/signup", (req, res) => {
    res.render("signup",  { 
        title: "Sign Up", currentRoute: "/signup", layout: welcomeLayout });
});

router.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    
    try {
       const user = await Auth.create({ email, password });
       const token = createToken(user._id);
       res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
       res.status(201).json({ user: user._id }); 
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors});
    }
});


router.get("/login", (req, res) => {
    res.render("login", { 
        title: "Login", currentRoute: "/login", layout: welcomeLayout });
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Auth.findOne({ email });
        if (user) { 
            const auth = await bcrypt.compare(password, user.password); 
            if (auth) {
                const token = createToken(user._id);
                res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
                res.status(201).json({ user: user._id });
                return user;
            } 
            throw Error("Incorrect password"); 
        }
        throw Error("Incorrect email");
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
});

router.get("/logout", (req,res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
})

router.get("/donation", (req, res) => {
    res.render("donation", { 
        title: "Donation", currentRoute: "/donation" });
});

router.get("/admin", (req, res) => {
    res.render("admin/index", { 
        title: "Admin Login", currentRoute: "admin/index" });
});

// cookies
router.get("/set-cookies", (req,res) => {
    // res.setHeader("Set-Cookie", "newUser=true");
    res.cookie("newUser", false);
    res.cookie("isEmployee", true, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true });

    res.send("you got the cookies!");
})

router.get("/read-cookies", (req,res) => {
    const cookies = req.cookies;
    console.log(cookies.newUser);
    res.json(cookies);
})

module.exports = router;