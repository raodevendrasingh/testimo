export const INITIAL_TIER = "starter";
export const INITIAL_TESTIMONIAL_COUNT = 10;
export const TESTIMONIAL_RESET_DAYS = 30;
export const VERIFY_CODE_EXPIRY_HOURS = 1;

export const getExpiryDate = () => {
	const date = new Date();
	date.setHours(date.getHours() + VERIFY_CODE_EXPIRY_HOURS);
	return date;
};

export const getResetDate = () => {
	const date = new Date();
	date.setDate(date.getDate() + TESTIMONIAL_RESET_DAYS);
	return date;
};
