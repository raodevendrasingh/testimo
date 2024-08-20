import { toast } from "sonner";

export const copyToClipboard = (text: string) => {
	navigator.clipboard.writeText(text);
	toast.success("Feedback URL copied to clipboard!");
};
