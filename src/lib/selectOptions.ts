import {
	Archive,
	ArrowRightFromLine,
	Clock,
	Coins,
	LucideIcon,
	MessageSquareQuote,
	PartyPopper,
	Star,
	Trash2,
} from "lucide-react";

export type Stats = {
	icon: LucideIcon;
	iconColor: string;
	title: string;
	value: number;
};

export const FeedbackStats: Stats[] = [
	{
		icon: Coins,
		iconColor: "text-orange-400",
		title: "Credits Remaining",
		value: 8,
	},
	{
		icon: MessageSquareQuote,
		iconColor: "text-indigo-400",
		title: "Testimonials Recieved",
		value: 2,
	},
	{
		icon: Star,
		iconColor: "text-yellow-400",
		title: "Average Rating",
		value: 4.5,
	},
	{
		icon: Clock,
		iconColor: "text-blue-500",
		title: "Most Recent Testimonial",
		value: 2,
	},
];

export type Status = {
	value: string;
	label: string;
	icon: LucideIcon;
};
export const statuses: Status[] = [
	{
		value: "approved",
		label: "Approve",
		icon: PartyPopper,
	},
	{
		value: "archived",
		label: "Archive",
		icon: Archive,
	},
	{
		value: "exported",
		label: "Export",
		icon: ArrowRightFromLine,
	},
	{
		value: "discarded",
		label: "Discard",
		icon: Trash2,
	},
];

export type Framework = {
	value: string;
	label: string;
};

export const languages: Framework[] = [
	{
		value: "react",
		label: "react",
	},
	{
		value: "angular",
		label: "angular",
	},
	{
		value: "vue",
		label: "vue",
	},
	{
		value: "swelte",
		label: "swelte",
	},
];
