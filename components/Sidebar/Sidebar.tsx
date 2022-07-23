import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FolderOutlineIcon from '@mui/icons-material/FolderOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import SettingsOutlineIcon from '@mui/icons-material/SettingsOutlined';
import GamepadIcon from '@mui/icons-material/Gamepad';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { Button, LinearProgress, Modal } from '@mui/material';
import { convertToComputingUnits, ratioBetweenComputingUnits } from '../../utils/functions';
import { dbGetSizeSum } from '../../services/tableland';
import { convertToUSD } from '../../utils/functions';

export const Sidebar = (props: any) => {
  	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [container, setContainer] = React.useState<any>(undefined);
	const [monthlyUSD, setMonthlyUSD] = React.useState(0);
  	const handleOpen = () => setOpen(true);
  	const handleClose = () => setOpen(false);
	  const [open, setOpen] = React.useState(false);
	const drawerWidth = 240;
	
	React.useEffect(() => {
		setContainer(() => window.document.body);
		dbGetSizeSum().then((data: string) => props.setSize(convertToComputingUnits(data)));
		handleConversion();
	}, [])

	const handleConversion = async () => {
		const value = await convertToUSD('matic', 5);
		setMonthlyUSD(Math.round(value * 100) / 100);
	}

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

   const drawer = (
    <>
			<Toolbar>
				<GamepadIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
				<Typography
					variant="h6"
					noWrap
					sx={{
						display: { xs: 'none', md: 'flex' },
						fontFamily: 'monospace',
						fontWeight: 700,
						letterSpacing: '.3rem',
						color: 'inherit',
						textDecoration: 'none',
						cursor: 'default',
						"&::selection": { background: "none" }
					}}
				>
					IPDrive
				</Typography>
			</Toolbar>
      <Divider />
      <List>
        {['My Drive', 'Shared'].map((text, index) => (
          <ListItem key={text} disablePadding>
						<Link href={index === 0 ? '/drive': '/shared'} passHref>
							<ListItemButton LinkComponent="a">
								<ListItemIcon>
									{index === 0 ? <FolderOutlineIcon /> : <PeopleOutlineIcon />}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Recent', 'Trash'].map((text, index) => (
          <ListItem key={text} disablePadding>
						<Link	href={index === 0 ? '/recent': '/trash'} passHref>
							<ListItemButton LinkComponent="a">
								<ListItemIcon>
									{index === 0 ? <ScheduleIcon /> : <DeleteOutlineIcon />}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</Link>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['Settings'].map((text, index) => (
          <ListItem key={text} disablePadding>
						<Link href="/settings" passHref>
							<ListItemButton LinkComponent="a">
								<ListItemIcon>
									{index === 0 ? <SettingsOutlineIcon /> : <MailIcon />}
								</ListItemIcon>
								<ListItemText primary={text} />
							</ListItemButton>
						</Link>
          </ListItem>
        ))}
      </List>

			<Box sx={{ margin: '0 20px', width: '80%', position: 'absolute', bottom: '20px' }}>
				<Typography variant='caption'>{props.size} of 20 GB used</Typography>
				<LinearProgress
					variant="determinate"
					value={ratioBetweenComputingUnits(props.size, "20 GB")} />
				<Button variant="outlined" onClick={handleOpen} sx={{ width: '100%', marginTop: 1 }}>
					Upgrade Now
				</Button>

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
					width: 500,
					bgcolor: 'background.paper',
					boxShadow: 4,
					borderRadius: '10px',
					p: 4,
				}}>
          <Typography variant="h6" component="h2" sx={{ marginTop: 1 }}>
				Upgrade your Storage to 1TB with 5 MATIC ($ {monthlyUSD}) per month!
          </Typography>
					<Box sx={{ marginTop: 1, display: 'flex', justifyContent: 'flex-end' }}>
						<Button color="primary" onClick={handleClose} sx={{ marginRight: 1, color: '#757575' }}>
							Cancel
						</Button>
						<Button color="primary" >
							Upgrade
						</Button>
					</Box>
        </Box>
      </Modal>
			</Box>
    </>
  );

  return (
		<>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
		</>
  );
}