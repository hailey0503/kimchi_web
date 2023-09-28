// pages/api/transactions.js

import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
	try {
		//console.log('7')
		const client = await clientPromise;
		const db = client.db("kimchi");
		const allPosts = await db.collection("transactions").find({}).limit( 20 ).toArray();
		//const allPosts = [{'a':10,'b':20,'n':30,'d':20}]
		//console.log('10')
		//console.log(allPosts)
      	res.json({ status: 200, data: allPosts });
	} catch (e) {
		console.error(e);
	}
 };

 