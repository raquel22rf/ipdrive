import { DeleteOutline, DriveFileMoveOutlined, DriveFileRenameOutline, FileDownloadOutlined, InfoOutlined, ShareOutlined } from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem, Menu, Paper } from '@mui/material';
import React from 'react';
import { retrieveFile } from '../../services/web3storage';

export const MenuComponent = (props : {menuEv:any, setMenuEv:any, files:any[]}) => {

  const handleCloseOptions = () => {
    props.setMenuEv(null);
  };

	const downloadFile = (e: any) => {
		const partial_cid = props.menuEv.target.parentElement.children[props.menuEv.target.parentElement.children.length-1].innerText.substring(1);
		// Folder case (need to zip)
		if(partial_cid === "-") return;

		const metadata = props.files.filter((file:any) => file.cid.slice(0, 6) === partial_cid.slice(0, 6) && file.cid.slice(-6) === partial_cid.slice(-6));

		retrieveFile(metadata[0].cid).then((data:any) => {
			const blob = new Blob([data], { type: 'application/octet-stream' });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', metadata[0].name);
			link.click();
			props.setMenuEv(null);
		});
	}

  return (
		<Menu
			keepMounted
			anchorReference='anchorPosition'
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'top',
				horizontal: 'left',
			}}
			anchorPosition={{
				top: props.menuEv ? props.menuEv.clientY: 0,
				left: props.menuEv ? props.menuEv.clientX: 0,
			}}
			open={Boolean(props.menuEv)}
			onClose={handleCloseOptions}>
			<MenuItem onClick={downloadFile}>
				<ListItemIcon>
					<FileDownloadOutlined fontSize="small" />
				</ListItemIcon>
				<ListItemText>Download</ListItemText>
			</MenuItem>
			<MenuItem>
				<ListItemIcon>
					<DriveFileRenameOutline fontSize="small" />
				</ListItemIcon>
				<ListItemText>Rename</ListItemText>
			</MenuItem>
			<MenuItem>
				<ListItemIcon>
					<DriveFileMoveOutlined fontSize="small" />
				</ListItemIcon>
				<ListItemText>Move</ListItemText>
			</MenuItem>
			<MenuItem>
				<ListItemIcon>
					<DeleteOutline fontSize="small" />
				</ListItemIcon>
				<ListItemText>Delete</ListItemText>
			</MenuItem>
			<MenuItem>
				<ListItemIcon>
					<ShareOutlined fontSize="small" />
				</ListItemIcon>
				<ListItemText>Share</ListItemText>
			</MenuItem>
			<MenuItem>
				<ListItemIcon>
					<InfoOutlined fontSize="small" />
				</ListItemIcon>
				<ListItemText>Info</ListItemText>
			</MenuItem>
		</Menu>
  );
};