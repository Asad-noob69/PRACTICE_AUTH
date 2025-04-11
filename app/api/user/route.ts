import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI); // Replace with your MongoDB connection string

export async function GET() {
    try {
        await client.connect();
        const database = client.db(process.env.DATABASE_NAME); // Replace with your database name
        const collection = database.collection(process.env.COLLECTION_NAME); // Replace with your collection name

        // Fetch user data from the MongoDB collection
        const user = await collection.findOne({ email: 'johndoe@gmail.com' }); // Replace with dynamic query if needed

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error: any) {
        console.error('Error fetching user:', error.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    } finally {
        await client.close();
    }
}
