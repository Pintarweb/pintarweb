const sqlite3 = require('sqlite3').verbose();
const path = 'D:\\AntiGravity Project\\pintarweb-scraper\\.wrangler\\state\\v3\\d1\\miniflare-D1DatabaseObject\\14ffc5bf21474daa19d8543caae1b57bf09627e4fb5acbe82e72ac2825b50110.sqlite';

const db = new sqlite3.Database(path);

db.serialize(() => {
    console.log("--- LIVE DATABASE SNAPSHOT ---");
    db.each("SELECT business_name, lead_score, website_url FROM leads ORDER BY rowid DESC LIMIT 10", (err, row) => {
        if (err) {
            console.error(err.message);
        }
        console.log(`[Score: ${row.lead_score}] ${row.business_name} | Web: ${row.website_url}`);
    });
});

db.close();
