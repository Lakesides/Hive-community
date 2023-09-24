AuthSchema.statics.login = async function(email, password) {

    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error("Incorrect password"); 
    }
    throw Error("Incorrect email");
}


try {
    const user = await Auth.login({ email, password });
    res.status(200).json({ user: user._id }); 
 } catch (err) {
     const errors = handleErrors(err);
     res.status(400).json({ }); 
 }

 
 const { email, password } = req.body;
 const user = await Auth.findOne({ email });
 if (user) {
     const auth = await bcrypt.compare(password, user.password);
     const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id }); 
        if (auth) {
            return user;
     }
     console.log("Incorrect password"); 
 }
 console.log("Incorrect email");