import { toast } from "sonner";

export const copyToClipboard = (text: string) => {
	navigator.clipboard.writeText(text);
	toast.success("Testimonial URL copied to clipboard!");
};
