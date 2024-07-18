import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
    },

    email: {
        type: String,
        required: [true, "Please provide email address"],
        unique: [true, "This email address already exist"],
        lowercase: true,
        validate:[validator.isEmail, 'Please provide a valid email address'],
    },

    picture: {
        type: String,
        default:
            "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"
    },

    status: {
        type: String,
        default: "Hey there ! I am using whatsapp",
    },

    password: {
        type: String,
        required: [true, "Please provide your password"],
        minLength: [
            6,
            "Please make sure your password is atleast 6 characters long",
        ],
        maxLength: [
            128,
            "Please make sure your password is less than 128 characters long",
        ],
    },
}, {
    collection: "users",
    timestamps: true,
});

userSchema.pre('save', async function(next){
    try{
        if(this.isNew){
            const salt = await bcrypt.genSalt(12);
            const hashedPass = await bcrypt.hash(this.password, salt);
            this.password = hashedPass;
        }
        next();
    }catch(error){
        next(error)
    }
})

const UserModel=mongoose.model.UserModel || mongoose.model("UserModel", userSchema);

export default UserModel;