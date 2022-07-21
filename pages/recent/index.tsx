import type { NextPage } from 'next'
import React, { useEffect } from 'react';
import { Drive } from '../../components/Drive/Drive'
import { File, dbGetRecentFiles } from '../../services/tableland';
import { getUserAddress } from '../../services/wallet';

const Recent: NextPage = () => {
	const [files, setFiles] = React.useState<File[]>([]);

	useEffect(() => {
		getUserAddress().then(addr => {
			dbGetRecentFiles(addr).then((data) => setFiles(data));
		});
	}, [files.length]);

	return (
		<>
			<Drive files={files} />
		</>
	)
}

export default Recent

