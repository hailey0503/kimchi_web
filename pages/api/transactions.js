import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("kimchi");
    const allTransactions = await db
      .collection("transactions")
      .find({}).limit(10)
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .toArray();
    res.json({ status: 200, data: allTransactions });
  } catch (e) {
    console.error(e);
  }
}
