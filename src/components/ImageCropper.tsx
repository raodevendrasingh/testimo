import { useState, useRef } from "react";
import ReactCrop, {
	Crop,
	PixelCrop,
	centerCrop,
	makeAspectCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import setCanvasPreview from "@/helpers/setCanvasPreview";
import { CropIcon } from "lucide-react";
import Image from "next/image";

interface ImageCropperProps {
	imageSrc: string | null;
	onCropComplete: (croppedImageData: string) => void;
}

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

export const ImageCropper: React.FC<ImageCropperProps> = ({
	imageSrc,
	onCropComplete,
}) => {
	const imgRef = useRef<HTMLImageElement>(null);
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

	const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
		const { width, height } = e.currentTarget;
		const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

		const crop = makeAspectCrop(
			{
				unit: "%",
				width: cropWidthInPercent,
			},
			ASPECT_RATIO,
			width,
			height
		);
		const centeredCrop = centerCrop(crop, width, height);
		setCrop(centeredCrop);
	};

	const handleCropComplete = () => {
		if (completedCrop && imgRef.current && previewCanvasRef.current) {
			setCanvasPreview(imgRef.current, previewCanvasRef.current, completedCrop);
			const dataUrl = previewCanvasRef.current.toDataURL();
			onCropComplete(dataUrl);
		}
	};

	return (
		<div className="absolute flex flex-col items-center p-10 z-60 bg-white mt-36 rounded-lg">
			<ReactCrop
				crop={crop}
				onChange={(_, percentCrop) => setCrop(percentCrop)}
				onComplete={(c) => setCompletedCrop(c)}
				aspect={ASPECT_RATIO}
				minWidth={MIN_DIMENSION}
			>
				<Image
					ref={imgRef}
					src={imageSrc || ""}
                    width={320}
                    height={320}
					alt="Crop me"
					onLoad={onImageLoad}
                    className="rounded"
				/>
			</ReactCrop>
			<button
				className="flex items-center justify-center gap-2 w-full mt-4 bg-slate-800 text-white font-semibold border rounded-lg text-sm px-4 py-2 shadow-sm hover:shadow-xl outline-hidden focus:outline-hidden ease-linear transition-all duration-150"
				onClick={handleCropComplete}
			>
				Crop 
                <CropIcon/>
			</button>
			<canvas ref={previewCanvasRef} style={{ display: "none" }} />
		</div>
	);
};
