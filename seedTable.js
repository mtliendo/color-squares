import { DynamoDBClient, BatchWriteItemCommand } from '@aws-sdk/client-dynamodb'
import { fromIni } from '@aws-sdk/credential-providers'
import { marshall } from '@aws-sdk/util-dynamodb'
import { v4 as uuidv4 } from 'uuid'
const credentialProvider = fromIni()

const dynamodb = new DynamoDBClient({ credentialProvider })

async function seedDynamoDBTable(tableName, itemCount) {
	const params = {
		RequestItems: {
			[tableName]: [],
		},
	}

	for (let i = 0; i < itemCount; i++) {
		const item = marshall({
			// Define your item properties here
			id: uuidv4(),
			__typename: 'Cell',
			color: `#ddd`,
			index: i,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		})

		params.RequestItems[tableName].push({
			PutRequest: {
				Item: item,
			},
		})

		if (params.RequestItems[tableName].length === 25) {
			try {
				const batchWriteCommand = new BatchWriteItemCommand(params)
				await dynamodb.send(batchWriteCommand)
				params.RequestItems[tableName] = []
				console.log(`Inserted ${i + 1} items.`)
			} catch (err) {
				console.error('Error inserting items:', err)
				break
			}
		}
	}

	if (params.RequestItems[tableName].length > 0) {
		try {
			const batchWriteCommand = new BatchWriteItemCommand(params)
			await dynamodb.send(batchWriteCommand)
			console.log(`Inserted ${itemCount} items.`)
		} catch (err) {
			console.error('Error inserting items:', err)
		}
	}
}

// Usage example
seedDynamoDBTable('Cell-bxd3hps2bbcxhglc7rx2kuvnvy-NONE', 2000)
