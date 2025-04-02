import mongoose from "mongoose";

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
	if (connection.isConnected) {
		// console.log("Aready connected to database");
		return;
	}
	try {
		const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

		connection.isConnected = db.connections[0].readyState;
		// console.log("Database Connnected successfully!");
	} catch (error) {
		console.error("Database Connnection Failed!", error);

		process.exit(1);
	}
}

export default dbConnect;
