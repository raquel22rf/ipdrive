import { connect } from "@tableland/sdk";

export interface File {
	cid: string;
	name: string;
	path: string;
	creationDate: string;
	modifiedDate: string;
	owner: string;
	size: number;
	shared: boolean;
	status: "pending" | "stored" | "deleted";
}

export interface Share {
	cid: string;
	address: string;
	permissions: "ro" | "rw";
}

export const dbConnect = async () => {
	const tableland = await connect({
		network: "testnet",
		chain: "polygon-mumbai",
	});

	return tableland;
}

export const dbCreateFilesTable = async () => {
	const tableland = await dbConnect();
	let receipt = await tableland.create(
		`cid text, name text, path text, creation_date text, modified_date text, owner text, size int, shared text, status text, primary key (cid)`,
		`ipdrive_files`
	);
	console.log(`Created files table: ${receipt.name}`);
}

export const dbCreateSharesTable = async () => {
	const tableland = await dbConnect();
	let receipt = await tableland.create(
		`cid text, address text, permissions text`,
		`ipdrive_shares`
	);
	console.log(`Created files table: ${receipt.name}`);
}

export const dbGetFiles = async () => {
	// ipdrive_files_80001_49
	// ipdrive_shares_80001_48
	const tableland = await dbConnect();
	const readRes = await tableland.read(`SELECT * FROM ipdrive_files_80001_49;`);
	console.log(readRes);
	let files: File[] = [];
	for (const row of readRes.rows) {
		files.push({
			cid: row[0],
			name: row[1],
			path: row[2],
			creationDate: row[3],
			modifiedDate: row[4],
			owner: row[5],
			size: row[6],
			shared: row[7] === "true",
			status: row[8],
		});
	}
	
	return files;
}

export const dbAddFile = async () => {
	const tableland = await dbConnect();
	const date = new Date().toISOString();
	const insertRes = await tableland.write(
		`INSERT INTO ipdrive_files_80001_49 (cid, name, path, creation_date, modified_date, owner, size, shared, status) VALUES (
			'bafybeiernexwp5rphpk6vltnvmgijphskw5aonvyvkqhyt4rfvvruvmu3m',
			'5263301.gif',
			'/test/',
			'` + date + `',
			'` + date + `',
			'0x5Ed3a87a8f45d9d471e1AeB1BCf73F5C6B037CAf',
			13327,
			'false',
			'pending');`
	);
	
	return insertRes;
}

export const dbUpdateFile = async () => {
	const tableland = await dbConnect();
	const updateRes = await tableland.write(`UPDATE mytable_80001_39 SET name = 'Bob' WHERE id = 0;`);
	
	return updateRes;
}

export const dbDeleteFile = async () => {
	const tableland = await dbConnect();
	const removeRes = await tableland.write(`DELETE FROM mytable_80001_39 WHERE id = 0;`);

	return removeRes;
}