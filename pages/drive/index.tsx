import { Alert, Box, Button, Modal, TextField, Typography } from '@mui/material'
import type { NextPage } from 'next'
import React, { useEffect, useRef } from 'react';

import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Drive as DriveComponent } from '../../components/Drive/Drive';
import { dbAddFile, dbConnect, dbCreateFilesTable, dbGetFiles, dbGetSizeSum, dbUpdateFile, File } from '../../services/tableland';
import { getUserAddress } from '../../services/wallet';
	
const Drive: NextPage = () => {
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

	useEffect(() => {
		getUserAddress().then(addr => setAddress(addr));
		dbGetFiles().then((data) => setFiles(data));
	}, []);

	return (
		<>
			<Button variant="outlined" startIcon={ <CreateNewFolderIcon /> } onClick={handleOpen} sx={{ margin: '0 5px 0 0', color: '#dedede', borderColor: '#757575' }}>New Folder</Button>
			<Button variant="outlined" startIcon={ <UploadFileIcon /> } sx={{ color: '#dedede', borderColor: '#757575' }}>Upload File</Button>

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
