"use client";

import { Testimonial } from "@/models/User";
import { Stars } from "@/components/ui/Stars";
import SyntaxHighlighter from "@/utils/SyntaxHighlighter";
import { Clipboard, ClipboardCheck } from "lucide-react";
import { useState } from "react";

const CopyableTitle = ({
	title,
	code,
	blockName,
}: {
	title: string;
	code: string;
	blockName: string;
}) => {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = () => {
		navigator.clipboard.writeText(code);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className="flex items-center justify-start gap-2 w-full">
			<span className="text-lg font-medium font-sans p-1">{title}</span>
			<button onClick={copyToClipboard} className="pt-0.5">
				{copied ? (
					<ClipboardCheck className="size-4 text-green-500" />
				) : (
					<Clipboard className="size-4 text-gray-500" />
				)}
			</button>
		</div>
	);
};

export const TestimonialCard = ({
	testimonial,
}: {
	testimonial: Testimonial;
}) => {
	return (
		<div className="border rounded-lg select-none p-5 flex flex-col items-center justify-center gap-2 w-[320px]">
			<span className="text-yellow-300 text-base flex">
				<Stars rating={testimonial.rating} />
			</span>
			<div className="flex h-full flex-col text-center text-sm flex-grow">
				{testimonial.content}
			</div>
			<div className="flex items-center justify-center gap-4 ">
				{testimonial.imageUrl && (
					<div>
						<img
							src={`https://res.cloudinary.com/dniezlcfy/image/upload/v1724431325/${testimonial.imageUrl}`}
							alt="pfp"
							width={40}
							height={40}
							className="rounded-full"
						/>
					</div>
				)}
				<div className="flex flex-col items-start">
					{testimonial.name && (
						<span className="text-base font-medium">{testimonial.name}</span>
					)}
					{testimonial.jobTitle && (
						<span className="text-xs font-medium text-gray-600">
							{testimonial.jobTitle}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export const CardToCode = ({
	testimonial,
}: {
	testimonial: Testimonial;
}): JSX.Element => {
	const StarBlock = `export const Stars = ({ rating }: { rating: number }) => {
    return (
        <span className="text-yellow-300 text-base flex">
            {Array.from({ length: rating }).map((_, index) => (
                <span key={index} className="text-xl">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-6"
                    >
                        <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                        />
                    </svg>
                </span>
            ))}
        </span>
    );
};`;

	const ComponentBlock = `// import the stars component from your preferred path
import { Stars } from "@/components/ui/Stars";

interface TestimonialCardProps {
    displayName?: string;
    content: string;
    rating: number;
    jobTitle?: string;
    imageUrl?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
    displayName,
    content,
    rating,
    jobTitle,
    imageUrl
}) => {
return (
    <div className="border rounded-lg select-none p-5 flex flex-col items-center justify-center gap-2 w-[320px]">
        <Stars rating={rating} />
        <div className="flex h-full flex-col text-center text-sm flex-grow">
            {content}
        </div>
        <div className="flex items-center justify-center gap-4 ">
            {imageUrl && (
                <div>
                    <img
                    src={\`https://res.cloudinary.com/dniezlcfy/image/upload/v1724431325/\${imageUrl}\`}
                    alt="profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                    />
                </div>
            )}
            <div className="flex flex-col items-start">
                {displayName && (
                    <span className="text-base font-medium">{displayName}</span>
                )}
                {jobTitle && (
                    <span className="text-xs font-medium text-gray-600">{jobTitle}</span>
                )}
            </div>
        </div>
    </div>
    );
};

export default TestimonialCard;`;

	const UsageBlock = `<TestimonialCard
    displayName="${testimonial.name || ""}"
    content="${testimonial.content || ""}"
    rating={${testimonial.rating}}
    jobTitle="${testimonial.jobTitle || ""}"
    imageUrl="${testimonial.imageUrl ? `${testimonial.imageUrl}` : ""}"
/>`;

	return (
		<div className="flex flex-col items-start justify-start gap-2 font-mono">
			<CopyableTitle title="Usage" code={UsageBlock} blockName="usage" />
			<SyntaxHighlighter language="jsx" code={UsageBlock} />

			<CopyableTitle
				title="Stars Component"
				code={StarBlock}
				blockName="stars"
			/>
			<SyntaxHighlighter language="jsx" code={StarBlock} />

			<CopyableTitle
				title="Component"
				code={ComponentBlock}
				blockName="component"
			/>
			<SyntaxHighlighter language="jsx" code={ComponentBlock} />
		</div>
	);
};
