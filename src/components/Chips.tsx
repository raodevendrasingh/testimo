import { motion } from "framer-motion";

interface ChipProps {
	index: number;
	text: string;
	selected: boolean;
	setSelected: (index: number) => void;
}

export const Chip = ({ index, text, selected, setSelected }: ChipProps) => {
	return (
		<button
			onClick={() => setSelected(index)}
			className={`${
				selected
					? "text-white"
					: "text-slate-800 hover:text-slate-200 hover:bg-slate-700"
			} text-sm transition-colors px-2.5 py-0.5 rounded-md relative`}
		>
			<span className="relative z-20">{text}</span>
			{selected && (
				<motion.span
					layoutId="pill-tab"
					transition={{ type: "spring", duration: 0.5 }}
					className="absolute inset-0 z-0 bg-gradient-to-r from-slate-700 to-zinc-700 rounded-md"
				></motion.span>
			)}
		</button>
	);
};
