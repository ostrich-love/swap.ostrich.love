
    //Import package
import { Client, auth } from "twitter-api-sdk";
export default () => {
 
// Initialize auth client first
const authClient = new auth.OAuth2User({
 client_id: 'd3kxcmlra1ZaT0tvUEdjaVBOWnk6MTpjaQ',
 client_secret: 'WYYdV7dr9_sLrWDQ3Qf7s6kRkm-b_VS0PIhaY1-CTUuCqdCeti',
 callback: "localhost:3000/callback",
 scopes: ["tweet.read", "users.read", "offline.access"],
});

 // Pass auth credentials to the library client 
 const twitterClient = new Client(authClient);
 const readLooks = async() => {
    const looks = await twitterClient.tweets.findTweetById('1632269904811532288', {
        // Optional parameters
        expansions: ["author_id"],
        "user.fields": ["created_at", "description", "name"],
      })
    console.log(looks)
 }
 readLooks()
 
    return ('123')
}