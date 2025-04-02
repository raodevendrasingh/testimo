import axios from "axios";

const cloudName = "dniezlcfy";
const uploadPreset = "pkyec5sk";

export const uploadToCloudinary = async (imageData: string): Promise<string> => {
	const formData = new FormData();
	formData.append("file", imageData);
	formData.append("upload_preset", uploadPreset);

	try {
		const response = await axios.post(
			`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
			formData,
		);
		return response.data.url;
	} catch (error) {
		console.error("Error uploading to profile picture:", error);
		throw error;
	}
};
