// One-off: point the 4 seeded brand tiles at the user's new logo files.
const { MongoClient } = require("mongodb");
const fs = require("fs");

const env = fs.readFileSync(".env.local", "utf8");
const uri = env.match(/MONGODB_URI=(.+)/)[1].trim();

const map = {
  "brand-brembo": "/images/brands/brembo.webp",
  "brand-bosch": "/images/brands/Bosch_logo.png",
  "brand-sachs": "/images/brands/Sachs-Logo.png",
  "brand-luk": "/images/brands/luk.svg",
};

(async () => {
  const client = new MongoClient(uri);
  await client.connect();
  const col = client.db().collection("categories");
  for (const [id, image] of Object.entries(map)) {
    const r = await col.updateOne({ id }, { $set: { image, updatedAt: new Date() } });
    console.log(id, "->", image, "| matched:", r.matchedCount);
  }
  await client.close();
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
