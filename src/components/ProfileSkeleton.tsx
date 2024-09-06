import { Skeleton } from "./ui/skeleton";

export const ProfileSkeleton = () => {
	return (
		<div className="w-full max-w-5xl h-28 flex items-center gap-2 rounded-lg">
			<div className="flex items-center justify-between gap-3 w-full">
				<div className="flex items-center justify-start gap-4 w-2/3">
					<Skeleton className="size-28 bg-slate-200 animate-pulse rounded-lg" />
					<div className="flex flex-col items-start justify-start gap-4">
						<Skeleton className="h-6 w-44 bg-slate-200 animate-pulse rounded-lg" />
						<Skeleton className="h-5 w-56 bg-slate-200 animate-pulse rounded-lg" />
						<div className="flex justify-start gap-2">
							<Skeleton className="h-5 w-44 bg-slate-200 animate-pulse rounded-lg" />
						</div>
					</div>
				</div>
				<div className="flex flex-col items-center justify-end gap-3 w-1/3">
					<Skeleton className="w-20 h-5 bg-slate-200 animate-pulse rounded-lg" />
					<Skeleton className="w-20 h-5 bg-slate-200 animate-pulse rounded-lg" />
					<Skeleton className="w-20 h-5 bg-slate-200 animate-pulse rounded-lg" />
				</div>
			</div>
		</div>
	);
};
