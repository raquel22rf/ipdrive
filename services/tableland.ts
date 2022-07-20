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

export const dbGetFiles = async (owner: string) => {
	// ipdrive_files_80001_49
	// ipdrive_shares_80001_48
	const tableland = await dbConnect();
	const readRes = await tableland.read(`SELECT * FROM ipdrive_files_80001_49
		WHERE owner = '` + owner + `';`);

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

export const dbGetSharedFiles = async () => {

}

export const dbGetRecentFiles = async (owner: string) => {
	const tableland = await dbConnect();
	const date = new Date();
	date.setDate(date.getDate() - 5);
	const readRes = await tableland.read(`SELECT * FROM ipdrive_files_80001_49
		WHERE owner = '` + owner + `' AND modified_date > '` + date.toISOString() + `';`);

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

export const dbGetDeletedFiles = async (owner: string) => {
	const tableland = await dbConnect();
	const readRes = await tableland.read(`SELECT * FROM ipdrive_files_80001_49
		WHERE owner = '` + owner + `' AND status = 'deleted';`);

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

export const dbGetSizeSum = async () => {
	const tableland = await dbConnect();
	const readRes = await tableland.read(`SELECT sum(size) FROM ipdrive_files_80001_49;`);

	return readRes.rows[0][0];
}

export const dbAddFile = async (cid: string, name: string, path: string, owner: string, size: number) => {
	const tableland = await dbConnect();
	const date = new Date().toISOString();
	const insertRes = await tableland.write(
		`INSERT INTO ipdrive_files_80001_49 (cid, name, path, creation_date, modified_date, owner, size, shared, status) VALUES (
			'` + cid + `',
			'` + name + `',
			'` + path + `',
			'` + date + `',
			'` + date + `',
			'` + owner + `',
			` + size + `,
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

export const dbDeleteFile = async (cid: string) => {
	const tableland = await dbConnect();
	//const removeRes = await tableland.write(`DELETE FROM mytable_80001_39 WHERE id = 0;`);
	const removeRes = await tableland.write(`UPDATE mytable_80001_39 SET status = 'deleted'
		WHERE cid = '` + cid + `';`);

	return removeRes;
}