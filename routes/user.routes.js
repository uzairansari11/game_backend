const express = require("express");
const { UserModel } = require("../model/user.model");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    const payload = req.body
    console.log(payload)

    const { name, password, email, isOnline } = payload
    try {
        if (name != undefined && password != undefined && email != undefined) {

            const isUserExists = await UserModel.find({ email: email })

            if (isUserExists.length) {
                return res.status(201).send({ message: "User already exists" });
            }

            const newUser = await new UserModel(payload);
            await newUser.save();
            res.status(200).send({ message: "User has been created successfully" });
        } else {
            res.status(201).send({ message: "Please provide all details" });
        }
    } catch (error) {
        res.status(400).send({ message: `something went wrong \n ${error}` });
    }
});

userRouter.post("/login", async (req, res) => {
    const payload = req.body;
    console.log(payload);
    const { email, password } = payload;

    try {
        if (email != undefined && password != undefined) {
            const isUserExists = await UserModel.find({ email: email, password: password });
            console.log(isUserExists)
            if (isUserExists.length) {
                res
                    .status(200)
                    .send({ message: "This is the user", data: isUserExists[0].name });
            } else {
                res.status(201).send({ message: "User does not exists" });
            }
        } else {
            res.status(201).send({ message: "Please provide all details" });
        }
    } catch (error) {
        res.status(400).send({ message: `something went wrong \n ${error}` });
    }
});

module.exports = { userRouter };
