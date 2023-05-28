import { StreamChat } from 'stream-chat';

// instantiate your stream client using the API key and secret
// the secret is only used server side and gives you full access to the API
// find your API keys here https://getstream.io/dashboard/
const serverClient = StreamChat.getInstance('387vjgfq9yxk', 'qh3fyuz5fesbx7wd8bavkwtx2pq7ncxnca8wtgp324r94ar3hrvezdcht7nky928');

// generate a token for the user with id 'john'
const token = serverClient.createToken('john');
// next, hand this token to the client in your in your login or registration response

// instantiate a new client (client side)
const client = StreamChat.getInstance('387vjgfq9yxk');