import type { Entries } from 'type-fest';
import { colors } from "./colors";

const checkmark = <svg className='text-3xl text-white	' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 20 20" aria-hidden="true" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>

export const Footer = ({
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
		<div className={`border-t-2	border-black py-4 z-50 bg-white overflow-auto`}>
			<div className="flex-wrap	 justify-center flex items-center gap-1">
			{(Object.entries(colors) as Entries<typeof colors>).map(([colorName, value]) => (
				<div className="flex flex-row-reverse gap-1 z-20">
					{Object.entries(value).map(([colorShade, hex]) => (
						<button
							key={`${colorName}-${colorShade}`}
							className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer`}
							style={{ backgroundColor: hex }}
							onClick={() => handleColorClick(hex)}
						>
							{hex === selectedColor ? checkmark : null}
						</button>
					))}
				</div>
			))}
			</div>
		</div>
	)
}
