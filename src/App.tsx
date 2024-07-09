import { Amplify } from 'aws-amplify'
import { useEffect, useState } from 'react'
import awsconfig from '../amplify_outputs.json'
import { generateClient } from 'aws-amplify/api'
import { Schema } from '../amplify/data/resource'
import { Footer } from './Footer'
Amplify.configure(awsconfig)

const client = generateClient<Schema>()

const Cell = ({
	item,
	selectedColor,
}: {
	item: Schema['Cell']['type']
	selectedColor: string
}) => {
	return (
		<button
			key={item.id}
			className="w-6 h-6 outline outline-1 outline-black hover:outline-fuchsia-600 hover:outline-2 hover:z-10"
			style={{ backgroundColor: item.color }}
			onClick={async () => {
				console.log('you clicked', item.id)
				await client.models.Cell.update({
					id: item.id,
					color: selectedColor,
				})
			}}
		/>
	)
}
const Grid = ({
	selectedColor,
	items,
}: {
	selectedColor: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	items: any[]
}) => {
	console.log('incoming data', items)
	return (
		<div className="flex flex-wrap w-[150rem]">
			{items.map((item) => {
				return <Cell key={item.id} item={item} selectedColor={selectedColor} />
			})}
		</div>
	)
}

function App() {
	const [selectedColor, setSelectedColor] = useState('#fff')
	const [items, setItems] = useState<
		{
			id: string
			index: number
			color: string
		}[]
	>([])

	useEffect(() => {
		client.models.Cell.list({ limit: 2000 })
			.then((response) => {
				console.log('triggered')
				setItems(response.data)
			})
			.catch((error) => {
				console.error(error)
			})
	}, [])

	useEffect(() => {
		const sub = client.models.Cell.onUpdate().subscribe({
			next: (data) => {
				console.log('update', data)
				console.log(data.id)
				setItems((prevItems) =>
					prevItems.map((item) =>
						item.id === data.id ? { ...item, color: data.color } : item
					)
				)
			},
			error: (error) => {
				console.error(error)
			},
		})

		return () => {
			sub.unsubscribe()
		}
	}, [])

	return (
		<div className="flex flex-col w-screen h-screen">
			<div className="flex-1 overflow-auto">
				<Grid selectedColor={selectedColor} items={items} />
			</div>
			<Footer
				setSelectedColor={setSelectedColor}
				selectedColor={selectedColor}
			/>
		</div>
	)
}

export default App
