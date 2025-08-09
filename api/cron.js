import { main } from "../index.js";

export default async function (req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method Not Allowed");
  }

  try {
    await main();
    return res.status(200).send("Meal data updated successfully.");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Server Error");
  }
}
