import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the base interface for User properties
export interface IUser {
    name: string;
    email: string;
    password: string;
    watchlist: mongoose.Types.ObjectId[];
}

// Define interface for instance methods
export interface IUserMethods {
    comparePassword(candidatePassword: string): Promise<boolean>;
    getUserDetails(): {
        name: string;
        email: string;
        watchlist: mongoose.Types.ObjectId[];
    };
}

// Create a type that combines the base interface with Document and methods
export type UserDocument = Document & IUser & IUserMethods;

// Define the model type
export type UserModel = Model<UserDocument>;

// Create the schema
const userSchema = new Schema<UserDocument, UserModel>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    watchlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
}, {
    timestamps: true
});

// Add pre-save middleware
userSchema.pre('save', async function(this: UserDocument, next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Add instance methods
userSchema.methods.comparePassword = async function(
    this: UserDocument,
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getUserDetails = function(
    this: UserDocument
) {
    return {
        name: this.name,
        email: this.email,
        watchlist: this.watchlist
    };
};

// Create and export the model
export const User = mongoose.model<UserDocument>('User', userSchema);