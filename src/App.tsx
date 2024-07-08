import { Amplify } from 'aws-amplify'
import { useEffect, useState } from 'react'
import awsconfig from '../amplify_outputs.json'
import { generateClient } from 'aws-amplify/api'
import { Schema } from '../amplify/data/resource'
Amplify.configure(awsconfig)

const colors = [
	// Red Variations
	'#FF0000',
	'#FF6666',
	'#990000',

	// Green Variations
	'#00FF00',
	'#66FF66',
	'#009900',

	// Blue Variations
	'#0000FF',
	'#6699FF',
	'#000099',

	// Yellow Variations
	'#FFFF00',
	'#FFFF66',
	'#999900',

	// Purple Variations
	'#800080',
	'#CC66CC',
	'#660066',

	// White and Black Variations
	'#FFFFFF',
	'#CCCCCC',
	'#000000',
	'#666666',
]

const client = generateClient<Schema>()

const Cell = ({
	item,
	selectedColor,
}: {
	item: Schema['Cell']['type']
	selectedColor: string
}) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any

	return (
		<div
			key={item.id}
			className="w-6 h-6 border border-black"
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
		<div className=" flex flex-wrap max-w-[1500px]">
			{items.map((item) => {
				return <Cell key={item.id} item={item} selectedColor={selectedColor} />
			})}
		</div>
	)
}

function App() {
	const [selectedColor, setSelectedColor] = useState('')
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
		<div className="App">
			<div className="flex justify-center mt-4">
				<Grid selectedColor={selectedColor} items={items} />
			</div>
			<Footer
				setSelectedColor={setSelectedColor}
				selectedColor={selectedColor}
			/>
		</div>
	)
}

const Footer = ({
	setSelectedColor,
	selectedColor,
}: {
	setSelectedColor: (color: string) => void
	selectedColor: string
}) => {
	const handleColorClick = (color: string) => {
		setSelectedColor(color)
	}

	return (
		<div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-4 flex items-center justify-center space-x-4">
			{colors.map((color) => (
				<div
					key={color}
					className="w-10 h-10 cursor-pointer"
					style={{ backgroundColor: color }}
					onClick={() => handleColorClick(color)}
				></div>
			))}
			<div className="ml-4 text-white">
				Selected Color: {selectedColor || 'None'}
			</div>
		</div>
	)
}

export default App
