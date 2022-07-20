import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import Link from 'next/link'
import React, { useEffect } from 'react';
import { File } from '../../services/tableland';
import Moment from 'moment';

import FolderIcon from '@mui/icons-material/Folder';
import DescriptionOutlineIcon from '@mui/icons-material/DescriptionOutlined';

import { MenuComponent } from './Menu';
import { getUserAddress } from '../../services/wallet';
import { convertToComputingUnits } from '../../utils/functions';


interface Column {
  id: 'name' | 'modified_date' | 'size' | 'cid';
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: string) => string;
}

// Add location for files not on 'My Drive'
// Add shared by for files on 'Shared'
interface Data {
	type: string;
  name: string;
  modified_date: string;
  size: number | string;
	cid: string;
	files: string[];
}

export function createData(
	type: string,
  name: string,
  modified_date: string,
  size: number | string,
	cid: string,
	files: string[],
): Data {
  return { type, name, modified_date, size, cid, files };
}

export const Drive = (props: {files: File[]}) => {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [menuEv, setMenuEv] = React.useState<any|null>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
	const [address, setAddress] = React.useState('');

	const columns: readonly Column[] = [
		{ id: 'name', label: 'Name', minWidth: 170, align: 'left' },
		{ id: 'modified_date', label: 'Last Modified', minWidth: 100, align: 'center',
			format: (value: string) => {
				const date = Moment(value.split(' ')[0]).format('MMM DD, YYYY');
				if (date === 'Invalid date') {
					return '-';
				}
				
				if (value.split(' ')[1]?.toLowerCase() === address) {
					return `${date} me`;
				} else {
					let addr = value.split(' ')[1];
					return `${date} ${addr.substring(0, 5) + '...' + addr.substring(addr.length - 5)}`;
				}
			}
		},
		{ id: 'size', label: 'File Size', minWidth: 170, align: 'center',
			format: (value: string) => convertToComputingUnits(value)
		},
		{ id: 'cid', label: 'CID', minWidth: 100, align: 'center',
			format: (value: string) => value === '-' ? '-': value.substring(0, 7) + ' ... ' + value.substring(value.length - 7, value.length)
		},
	];
	let data: Data[] = [];

	useEffect(() => {
		getUserAddress().then(addr => setAddress(addr));
	});

	props.files?.forEach((file: File, index: number) => {
		if (file.name.charAt(file.name.length - 1) === '/') {
			data.push(createData(
				'folder',
				file.name.substring(0, file.name.length - 1),
				file.modifiedDate + ' ' + file.owner,
				'-',
				'-',
				[]
			));
		} else if (file.path !== '/') {
			// filter
			if (data.filter(d => d.name === file.path.split('/')[1]).length === 0) {
				data.push(createData(
					"folder",
					file.path.split('/')[1], // change for parent folder instead of root (come as an url param)
					file.modifiedDate + ' ' + file.owner,
					'-',
					'-',
					[file.cid],
				));
			}	else {
				let folder = data.filter(d => d.name === file.path.split('/')[1])[0]
				folder.files.push(file.cid);
				if (folder.modified_date < file.modifiedDate) {
					folder.modified_date = file.modifiedDate + ' ' + file.owner;
				}
			}
		} else {
			data.push(createData(
				"file",
				file.name,
				file.modifiedDate + ' ' + file.owner,
				file.size,
				file.cid,
				[]
			));
		}
	});

	data.sort((a, b) => {
		if (a.type === 'folder' && b.type === 'file') {
			return -1;
		}
		if (a.type === 'file' && b.type === 'folder') {
			return 1;
		}
		return a.name.localeCompare(b.name);
	});

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenOptions = (event: React.MouseEvent<HTMLElement>) => {
		event.preventDefault();
    setMenuEv(event);
  };

  return (
		<>
			<Paper sx={{ width: '100%', overflow: 'hidden' }}>
				<TableContainer sx={{
					maxHeight: `calc(100vh - 210px)`,
					"&::-webkit-scrollbar": {
					width: 5
					},
					"&::-webkit-scrollbar-thumb": {
					backgroundColor: "#757575",
					borderRadius: 2
					}
				}}>
					<Table stickyHeader aria-label="sticky table">
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										key={column.id}
										align={column.align}
										sx={{
											minWidth: column.minWidth,
											cursor: 'default',
											"&::selection": { background: "none" }
										}}
									>
										{column.label}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody>
							{data
								?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row) => {
									return (
										<>
											<TableRow hover role="checkbox" tabIndex={-1} key={row.name} onContextMenu={handleOpenOptions}>
												{columns.map((column) => {
													const value = row[column.id];
													return (
														<>
															<TableCell
																key={column.id}
																align={column.align}
																sx={{
																	minWidth: column.minWidth,
																	cursor: 'default',
																	"&::selection": { background: "none" }
																}}
															>
																{column.id === 'name' ? row.type === 'folder' ? <FolderIcon sx={{ verticalAlign:"middle" }} /> : <DescriptionOutlineIcon sx={{ verticalAlign:"middle" }} /> : <></>}
																&emsp; 
																{column.format ?
																	column.format(value.toString())
																	: value}
															</TableCell>
														</>
													);
												})}
											</TableRow>
											<MenuComponent
												menuEv={menuEv}
												setMenuEv={setMenuEv}
												files={data}
											/>
										</>
									);
								})}
						</TableBody>
					</Table>
				</TableContainer>
				<TablePagination
					rowsPerPageOptions={[10, 25, 100]}
					component="div"
					count={data? data.length: 0}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Paper>
		</>
  );
}