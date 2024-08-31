import { cn } from "@/lib/utils";
import Marquee from "@/components/magicui/marquee";
import { Stars } from "./ui/Stars";
import Image from "next/image";

interface TestimonialCardProps {
	displayName?: string;
	content: string;
	rating: number;
	jobTitle?: string;
	imageUrl?: string;
}

const reviews = [
	{
		displayName: "Jane Taylor",
		content: "I'm thrilled to see this level of innovation!",
		jobTitle: "Software Engineer",
		rating: 4,
	},
	{
		displayName: "Logan Hall",
		content: "The attention to detail is impressive. Great job!",
		imageUrl: "https://i.pravatar.cc/150?img=56",
		jobTitle: "Marketing Manager",
		rating: 5,
	},
	{
		displayName: "David Kapoor",
		content: "This is a game-changer. I'm excited to see where it goes!",
		imageUrl: "https://i.pravatar.cc/150?img=7",
		jobTitle: "Product Designer",
		rating: 5,
	},
	{
		displayName: "Noah Martin",
		content: "I was skeptical at first, but this really delivers.",
		imageUrl: "https://i.pravatar.cc/150?img=11",
		jobTitle: "UX Researcher",
		rating: 4,
	},
	{
		displayName: "Mike Brawn",
		content: "The data speaks for itself. This is a huge success!",
		imageUrl: "https://i.pravatar.cc/150?img=12",
		jobTitle: "Data Scientist",
		rating: 5,
	},
	{
		displayName: "Meloney Shanning",
		content: "I love how intuitive this is. Great user experience!",
		imageUrl: "https://i.pravatar.cc/150?img=19",
		jobTitle: "Content Writer",
		rating: 4,
	},
	{
        displayName: "Emily Wong",
		content: "This has saved me so much time. Thank you!",
		imageUrl: "https://i.pravatar.cc/150?img=23",
		jobTitle: "Full Stack Developer",
		rating: 5,
	},
	{
		displayName: "Sara Katich",
		content: "The design is sleek and modern. I love it!",
		imageUrl: "https://i.pravatar.cc/150?img=27",
		jobTitle: "Social Media Manager",
		rating: 4,
	},
	{
		displayName: "Benjamin White",
		content: "I'm impressed by the scalability. Great work!",
		imageUrl: "https://i.pravatar.cc/150?img=53",
		jobTitle: "DevOps Engineer",
		rating: 5,
	},
	{
		displayName: "Ava Lee",
		content: "This has exceeded my expectations. Well done!",
		imageUrl: "https://i.pravatar.cc/150?img=35",
		jobTitle: "Product Manager",
		rating: 4,
	},
	{
		displayName: "Caleb Lewis",
		content: "The architecture is solid. I'm excited to see where this goes!",
		imageUrl: "https://i.pravatar.cc/150?img=61",
		jobTitle: "Solutions Architect",
		rating: 5,
	},
	{
		displayName: "Sarah Willis",
		content: "I love how easy this is to use. Great job!",
		imageUrl: "https://i.pravatar.cc/150?img=43",
		jobTitle: "Digital Marketing Specialist",
		rating: 4,
	},
	{
		displayName: "Michelle Williams",
		content: "This has been a huge help. Thanks for creating this!",
		imageUrl: "https://i.pravatar.cc/150?img=47",
		jobTitle: "Cybersecurity Engineer",
		rating: 5,
	},
	{
        displayName: "Mike Emanuel",
		content: "The content is engaging and informative. Well done!",
		imageUrl: "https://i.pravatar.cc/150?img=51",
		jobTitle: "Content Strategist",
		rating: 4,
	},
	{
		displayName: "Liam Patel",
		content: "This is a masterpiece. I'm so impressed!",
		imageUrl: "https://i.pravatar.cc/150?img=55",
		jobTitle: "Artificial Intelligence Engineer",
		rating: 5,
	},
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const TestimonialCard: React.FC<TestimonialCardProps> = ({
	displayName,
	content,
	rating,
	jobTitle,
	imageUrl,
}) => {
	return (
		<figure className="relative w-80 select-none bg-white p-5 flex flex-col items-center justify-center gap-2 cursor-pointer overflow-hidden rounded-xl border h-auto min-h-[100px]">
			<Stars rating={rating} />
			<div className="text-center text-sm">{content}</div>
			<div className="flex items-center justify-center gap-4 mt-2">
				{imageUrl && (
					<div>
						<Image
							src={imageUrl}
							alt="profile"
							width={40}
							height={40}
							className="rounded-full"
						/>
					</div>
				)}
				<div
					className={cn(
						"flex flex-col",
						imageUrl ? "items-start" : "items-center"
					)}
				>
					{displayName && (
						<span className="text-base font-medium">{displayName}</span>
					)}
					{jobTitle && (
						<span className="text-xs font-medium text-gray-600">
							{jobTitle}
						</span>
					)}
				</div>
			</div>
		</figure>
	);
};

export function MarqueeSection() {
	return (
		// <div className="relative flex h-[800px] bg-[#0f0f0f] w-full flex-col items-center justify-center border-t border-zinc-800 overflow-hidden md:shadow-xl">
		// 	<h2 className="text-5xl font-bold text-white mb-32">
		// 		Create Your Own Stunning Testimonial Wall
		// 	</h2>
		// 	<Marquee pauseOnHover className="[--duration:30s]">
		// 		{firstRow.map((review) => (
		// 			<TestimonialCard key={review.content} {...review} />
		// 		))}
		// 	</Marquee>
		// 	<Marquee reverse pauseOnHover className="[--duration:30s]">
		// 		{secondRow.map((review) => (
		// 			<TestimonialCard key={review.content} {...review} />
		// 		))}
		// 	</Marquee>
		// 	<div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r "></div>
		// 	<div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l"></div>
		// </div>

		<div className="relative flex h-[800px] bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] w-full flex-col items-center justify-center border-t border-zinc-800 overflow-hidden md:shadow-xl">
			<h2 className="text-5xl font-bold text-white mb-8 text-center px-4">
				Create Your Own Stunning Testimonial Wall
			</h2>
			<p className="text-xl text-gray-400 mb-16 max-w-2xl text-center px-4">
				Showcase your customer feedback with our beautiful, customizable
				testimonial cards
			</p>
			<Marquee pauseOnHover className="[--duration:35s] mb-4">
				{firstRow.map((review) => (
					<TestimonialCard key={review.content} {...review} />
				))}
			</Marquee>
			<Marquee reverse pauseOnHover className="[--duration:35s]">
				{secondRow.map((review) => (
					<TestimonialCard key={review.content} {...review} />
				))}
			</Marquee>
			<div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#0f0f0f]"></div>
			<div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-[#0f0f0f]"></div>
			
		</div>
	);
}
