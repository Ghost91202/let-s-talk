const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function cleanup() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;

    // Drop the problematic index
    await db.collection('users').dropIndex('userName_1');
    console.log('Successfully dropped userName_1 index');

    // Clean up documents with null userName
    const result = await db.collection('users').updateMany(
      { userName: null },
      { $unset: { userName: "" } }
    );
    console.log(`Updated ${result.modifiedCount} documents`);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

cleanup();
