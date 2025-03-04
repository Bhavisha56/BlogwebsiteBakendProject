import mongoose from "mongoose";

export const dataBaseConnection = async () => {
    try {
        mongoose.connect(process.env.DB_URL).then(() => {
            console.log(`database connected`);
        }).catch((error) => {
            console.log(error.message);
        });
    } catch (error) {
        console.log(error?.message);
        process.exit(1);
    }
}