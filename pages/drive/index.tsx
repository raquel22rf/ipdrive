import { Alert, Box, Button, Modal, TextField, Typography } from '@mui/material'
import type { NextPage } from 'next'
import React, { useEffect, useRef } from 'react';

import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Drive as DriveComponent } from '../../components/Drive/Drive';
import { dbAddFile, dbCreateFilesTable, dbGetFiles, dbGetSizeSum, File } from '../../services/tableland';
import { getUserAddress } from '../../services/wallet';
import { storeFiles } from '../../services/web3storage';
import { convertToComputingUnits } from '../../utils/functions';
import lit from "../../services/lit";

const Drive: NextPage = (props: any) => {
	const [files, setFiles] = React.useState<File[]>([]);
  	const [open, setOpen] = React.useState(false);
	const [address, setAddress] = React.useState('');
  	const handleOpen = () => setOpen(true);
  	const handleClose = () => setOpen(false);
	const folderEl = useRef<HTMLInputElement>(null);

	const handleCreateFolder = () => {
		if(folderEl.current && folderEl.current.value) {
			setFiles([...files, {
				cid: '-',
				name: folderEl.current.value + '/',
				path: '/' + folderEl.current.value + '/',
				creationDate: new Date().toISOString(),
				modifiedDate: new Date().toISOString(),
				owner: address,
				size: 0,
				shared: false,
				status: 'pending',
			}]);
		}
		setOpen(false);
	}

	// to delete
	const delay = (ms:any) => new Promise(res => setTimeout(res, ms));

	const handleFileUpload = async (e: any) => {
		const { encryptedFile, encryptedSymmetricKey } = await lit.encrypt(e.target.files[0]);		
		const cid = await storeFiles(e.target.files[0]);
		await dbAddFile(cid, e.target.files[0].name, '/', address, e.target.files[0].size);
		setFiles([...files, {
			cid,
			name: e.target.files[0].name,
			path: '/',
			creationDate: new Date().toISOString(),
			modifiedDate: new Date().toISOString(),
			owner: address,
			size: e.target.files[0].size,
			shared: false,
			status: 'pending',
		}]);
		dbGetSizeSum().then((data: string) => props.setSize(convertToComputingUnits((Number(data) + e.target.files[0].size).toString())));

		// to delete
		await delay(5000);
		console.log("Waited 5s");

		await delay(5000);
		console.log("Waited an additional 5s");

		console.log('DECRYPTION')
		const { decryptedFile } = await lit.decrypt(encryptedFile, encryptedSymmetricKey)
		console.log('file descripted', decryptedFile)

		// until here

	}

	useEffect(() => {
		getUserAddress().then(addr => {
			setAddress(addr);
			dbGetFiles(addr).then((data) => setFiles(data));
		});
	}, []);

	return (
		<>
			<Button variant="outlined" startIcon={ <CreateNewFolderIcon /> } onClick={handleOpen} sx={{ margin: '0 5px 0 0', color: '#dedede', borderColor: '#757575' }}>New Folder</Button>
			<Button
				variant="outlined"
				component="label"
				startIcon={ <UploadFileIcon /> }
				sx={{ color: '#dedede', borderColor: '#757575' }}>
				Upload File
				<input
					type="file"
					onChange={handleFileUpload}
					hidden
				/>
			</Button>
			
			<DriveComponent files={files} />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
					position: 'absolute' as 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
					width: 400,
					bgcolor: 'background.paper',
					boxShadow: 4,
					borderRadius: '10px',
					p: 4,
				}}>
					<Alert severity="warning">Folders will only persist after files are uploaded inside them!</Alert>

          <Typography variant="h6" component="h2" sx={{ marginTop: 1 }}>
						New Folder
          </Typography>

					<TextField inputRef={folderEl} variant="outlined" sx={{ marginTop:1, width: "100%" }} />

					<Box sx={{ marginTop: 1, display: 'flex', justifyContent: 'flex-end' }}>
						<Button color="primary" onClick={handleClose} sx={{ marginRight: 1, color: '#757575' }}>
							Cancel
						</Button>
						<Button color="primary" onClick={handleCreateFolder}>
							Create
						</Button>
					</Box>
        </Box>
      </Modal>
		</>
	)
}

export default Drive
