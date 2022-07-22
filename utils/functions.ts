
export const convertToComputingUnits = (value: string) => {
	if (value === '-')
		return '-'

	// convert bytes to KB, MB, GB, etc
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	if (value === '0')
		return '0 Bytes';
	
	const i = parseInt(value, 10) === 0 ? 0 : Math.floor(Math.log(parseInt(value, 10)) / Math.log(1024));
	return `${parseFloat((parseInt(value, 10) / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

export const convertFromComputingUnits = (value: string) => {
	// convert KB, MB, GB, etc to bytes
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
	const i = sizes.indexOf(value.match(/[a-zA-Z]+/)[0]);
	return `${parseInt(value.match(/\d+/)[0], 10) * Math.pow(1024, i)}`;
}

export const ratioBetweenComputingUnits = (v1: string, v2: string): number => {
	const value1 = convertFromComputingUnits(v1);
	const value2 = convertFromComputingUnits(v2);

	return parseInt(value1, 10) * 100 / parseInt(value2, 10);
}

export const convertToUSD = async (token:string, value: number) => {
	const response = await fetch('https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&tickers=' + token + '&key=ckey_be6ce18e2e8743df94fe7c614eb');
	const json = await response.json();
	let res = json.data.items[0].quote_rate;
	return res * value;
}