// To complie
// npx ts-node --skip-project ./src/script/streamChat.ts
import { StreamChat } from 'stream-chat';

const serverClient = StreamChat.getInstance(
	'7tx32qcnsxzm',
	'deqg3ehewd2u5t4ns74bxzm7qs26q6nyntgw4q3rgzyrze5f2xqcsy9fq4f2k9sg'
);

async function main() {
	console.log('start');
	// await serverClient.createChannelType({
	// 	name: 'classroom',
	// });
	const channelTypes = await serverClient.listChannelTypes();
	console.log(channelTypes);
}

main()
	.then(async () => {
		console.log('Success');
	})
	.catch(async (e) => {
		console.error(e);
	});
