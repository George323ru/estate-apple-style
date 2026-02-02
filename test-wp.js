import https from 'https';

const WP_URL = 'https://realtorvspb.ru/wp-json/wp/v2/posts?per_page=3';

console.log(`🤖 Starting WP Connection Test...`);
console.log(`Target: ${WP_URL}`);
console.log('-----------------------------------');

https.get(WP_URL, (res) => {
    console.log(`📡 Status Code: ${res.statusCode}`);
    console.log(`📜 Headers: content-type = ${res.headers['content-type']}`);

    let data = '';

    // A chunk of data has been received.
    res.on('data', (chunk) => {
        data += chunk;
    });

    // The whole response has been received.
    res.on('end', () => {
        console.log('-----------------------------------');
        if (res.statusCode === 200) {
            try {
                const posts = JSON.parse(data);
                console.log(`✅ SUCCESS! Found ${posts.length} posts.`);
                if (posts.length > 0) {
                    console.log('--- 🔍 FULL DATA OF FIRST POST ---');
                    console.log(JSON.stringify(posts[0], null, 2));
                    console.log('-----------------------------------');
                }
                posts.forEach(post => {
                    console.log(`   📝 Post ID: ${post.id} | Title: ${post.title.rendered}`);
                });
                console.log('\n🚀 Connection Verified: Your WP API is public and working!');
            } catch (e) {
                console.error('❌ Error parsing JSON:', e.message);
                console.log('Raw output:', data.substring(0, 200) + '...');
            }
        } else {
            console.error('❌ HTTP Error:', res.statusCode);
            console.error('Raw Body:', data);
        }
    });

}).on("error", (err) => {
    console.log("❌ Network Error: " + err.message);
    console.log("-----------------------------------");
    console.log("Possible causes:");
    console.log("1. SSL/Certificate issue (if using https)");
    console.log("2. Server firewall blocking requests");
    console.log("3. Incorrect URL");
});
