import { Skeleton } from "./ui/skeleton";

export const FeedbackSkeleton = () => {
	return (
		<div className="w-full max-w-5xl h-28 flex items-center gap-2 bg-slate-50 rounded-lg">
			<div className="w-20% px-10">
				<Skeleton className="size-24 rounded-lg bg-slate-200 " />
			</div>
			<div className="flex flex-col gap-2 w-[60%]">
				<div className="flex items-center gap-2">
					<Skeleton className="h-6 w-36 bg-slate-200" />
					<div className="flex items-center gap-2">
						<Skeleton className="size-5 bg-slate-200" />
						<Skeleton className="size-5 bg-slate-200" />
						<Skeleton className="size-5 bg-slate-200" />
						<Skeleton className="size-5 bg-slate-200" />
						<Skeleton className="size-5 bg-slate-200" />
					</div>
				</div>
				<Skeleton className="h-3 w-20 bg-slate-200" />
				<Skeleton className="h-12 w-full bg-slate-200" />
			</div>
			<div className="h-28  w-[20%] flex items-center justify-center">
				<Skeleton className="h-10 w-28 bg-slate-200" />
			</div>
		</div>
	);
};
