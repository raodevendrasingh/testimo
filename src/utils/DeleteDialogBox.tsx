import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type DeleteDialogProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
};

export const DeleteDialog = ({
	isOpen,
	onOpenChange,
	onConfirm,
}: DeleteDialogProps) => (
	<Dialog open={isOpen} onOpenChange={onOpenChange}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Are you absolutely sure?</DialogTitle>
				<DialogDescription>
					This action cannot be undone. This will permanently delete this
					testimonial and remove it from our servers.
				</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				<DialogClose onClick={() => onOpenChange(false)}>
					<Button type="button" variant="secondary" className="w-full">
						Close
					</Button>
				</DialogClose>
				<DialogClose onClick={onConfirm}>
					<Button type="button" variant="destructive" className="w-full">
						Delete
					</Button>
				</DialogClose>
			</DialogFooter>
		</DialogContent>
	</Dialog>
);
