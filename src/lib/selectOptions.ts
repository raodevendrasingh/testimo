import {
	Archive,
	ArrowRightFromLine,
	LucideIcon,
	PartyPopper,
	Trash2,
} from "lucide-react";

export type Stats = {
	icon: LucideIcon;
	iconColor: string;
	title: string;
	value: number | string;
};

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
		value: "svelte",
		label: "svelte",
	},
];
