import { DeleteOutline, DriveFileMoveOutlined, DriveFileRenameOutline, FileDownloadOutlined, InfoOutlined, ShareOutlined } from '@mui/icons-material';
import { ListItemIcon, ListItemText, MenuItem, Menu, Paper } from '@mui/material';
import React from 'react';

export const MenuComponent = (props : {menuEv:any, setMenuEv:any}) => {

  const handleCloseOptions = () => {
    props.setMenuEv(null);
  };

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
			<MenuItem>
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