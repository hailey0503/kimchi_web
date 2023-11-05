import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("kimchi");
    const [allTransactions, wemixData] = await Promise.all([
      db.collection("transactions").find({}).sort({ timestamp: -1 }).toArray(),
      db.collection("wemix").find({}).sort({ timestamp: -1 }).toArray(),
    ]);

    res.json({ transactions: allTransactions, wemix: wemixData });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal server error" });
  }
}
