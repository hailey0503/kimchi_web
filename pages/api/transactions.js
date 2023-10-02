// pages/api/transactions.js

import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    //console.log('7')
    const client = await clientPromise;
    const db = client.db("kimchi");
    const allTransactions = await db
      .collection("transactions")
      .find({})
      .toArray();
    res.json({ status: 200, data: allTransactions });
  } catch (e) {
    console.error(e);
  }
}
