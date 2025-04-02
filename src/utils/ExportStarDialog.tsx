import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { type Framework, languages } from "@/lib/selectOptions";
import { StarBlock } from "@/utils/StarsCodeBlock";
import { CopyableTitle } from "@/utils/TestimonialComponents";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import SyntaxHighlighter from "./SyntaxHighlighter";

type ExportStarDialogProps = {
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
};

export const ExportStarDialog = ({ isOpen, onOpenChange }: ExportStarDialogProps) => {
	const [openLang, setOpenLang] = useState(false);
	const [selectedLang, setSelectedLang] = useState<Framework | null>(null);

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<DialogContent className="flex flex-col justify-start items-center h-[90%]">
				<DialogHeader className="flex flex-col justify-start w-full">
					<DialogTitle className="tracking-wider">Export Stars</DialogTitle>
					<DialogDescription>Paste the component in your code</DialogDescription>
				</DialogHeader>

				<div className="flex items-center justify-center w-full h-full">
					<div className="w-full h-full rounded-lg overflow-x-hidden">
						<div className="w-full h-80">
							<div className="flex items-center justify-between">
								<CopyableTitle title="Stars Component" code={StarBlock} blockName="stars" />
								<Popover open={openLang} onOpenChange={setOpenLang}>
									<PopoverTrigger asChild>
										<button
											type="button"
											disabled
											className="w-28 rounded-lg font-mono mb-1 text-sm border border-gray-300 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{selectedLang ? (
												<span className="flex items-center justify-center gap-1 font-mono">
													<span className="w-[75%]">{selectedLang.label}</span>
													<span className="w-[25%]">
														<ChevronDown className="size-4" />
													</span>
												</span>
											) : (
												<span className="flex items-center justify-center font-mono gap-1">
													<span className="w-[75%] font-mono font-medium">react</span>
													<span className="w-[25%]">
														<ChevronDown className="size-4" />
													</span>
												</span>
											)}
										</button>
									</PopoverTrigger>
									<PopoverContent className="p-0" width="96px" side="bottom" align="center">
										<Command>
											<CommandList className="font-mono">
												<CommandGroup>
													{languages.map((lang) => (
														<CommandItem
															key={lang.value}
															value={lang.value}
															className=""
															onSelect={(value) => {
																const selectedLang =
																	languages.find((lang) => lang.value === value) || null;
																setSelectedLang(selectedLang);
																setOpenLang(false);
															}}
														>
															{lang.label}
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
							</div>

							<SyntaxHighlighter language="jsx" code={StarBlock} />
						</div>
					</div>
				</div>

				<DialogFooter className="w-full">
					<DialogClose asChild>
						<Button type="button" variant="secondary" className="w-full">
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
