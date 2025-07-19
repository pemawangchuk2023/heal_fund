import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
	throw new Error(
		"The keys for the MongoDB connection are not defined. Please set the MONGODB_URI environment variable."
	);
}

let databaseConnection: mongoose.Mongoose | null = null;

export default async function connectToDatabase(): Promise<mongoose.Mongoose> {
	if (databaseConnection) {
		return databaseConnection;
	}
	try {
		databaseConnection = await mongoose.connect(MONGODB_URI, {
			dbName: "HealFund",
		});
		console.log("You have successfully connected to MongoDB");
		return databaseConnection;
	} catch (error) {
		console.error("There was an error connecting to MongoDB");
		throw error;
	}
}
