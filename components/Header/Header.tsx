import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

import { checkIfUserIsConnected, connectWallet, getUserAddress, getUserBalance, checkChain} from './../../services/wallet';
import { Button, ButtonGroup } from '@mui/material'

const settings = ['Settings', 'Logout'];

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

export const Header = () => {
	const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
	const [isUserConnected, setIsUserConnected] = React.useState("");
	const [userAddress, setUserAddress] = React.useState("");
	const [userBalance, setUserBalance] = React.useState("");

	React.useEffect(() => {
		handleWallet();
	}, []);

	const handleWallet = async () => {
		
		if (await checkChain()){
			setIsUserConnected(await checkIfUserIsConnected());
			setUserAddress(await getUserAddress());

			const balance = await getUserBalance();
			setUserBalance(String(Math.round(Number(balance) * 10000) / 10000));
		} else {
			// add message to change chain
		}
	}

	const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const drawerWidth = 240;
  	const [mobileOpen, setMobileOpen] = React.useState(false);
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

  return (
		<AppBar
			position="fixed"
			sx={{
				width: { sm: `calc(100% - ${drawerWidth}px)` },
				ml: { sm: `${drawerWidth}px` },
			}}
		>
			<Toolbar>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={handleDrawerToggle}
					sx={{ mr: 2, display: { sm: 'none' } }}
				>
					<MenuIcon />
				</IconButton>

				<Search>
					<SearchIconWrapper>
						<SearchIcon />
					</SearchIconWrapper>
					<StyledInputBase
						placeholder="Search…"
						inputProps={{ 'aria-label': 'search' }}
					/>
				</Search>

				<Box sx={{ flexGrow: 1 }} />

				{isUserConnected == 'false' && 
					<Button 
						variant="outlined" 
						sx={{ margin: '0 5px 0 0', color: '#dedede', borderColor: '#757575' }} 
						onClick={connectWallet}>
							Connect your wallet
					</Button>}

				{isUserConnected == 'true' && 
					<Box sx={{ display: 'flex' }} >
						<ButtonGroup variant="outlined" aria-label="outlined button group">
							<Button
								disabled
								sx={{":disabled": { color: '#dedede', borderColor: '#757575', textTransform: 'none' }}}>
								{userBalance} MATIC &nbsp;
								<img src="/images/polygon-logo.svg" width="25" height="25" />
							</Button>
							<Button 
								variant="outlined" 
								sx={{ color: '#dedede', borderColor: '#757575', textTransform: 'none' }} 
								onClick={handleOpenUserMenu}>
								{userAddress.substring(0, 7) + ' ... ' + userAddress.substring(userAddress.length - 7, userAddress.length)}
							</Button>
						</ButtonGroup>
						<Menu
							sx={{ mt: '45px' }}
							id="menu-appbar"
							anchorEl={anchorElUser}
							anchorOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'right',
							}}
							open={Boolean(anchorElUser)}
							onClose={handleCloseUserMenu}
						>
							{settings.map((setting) => (
								<MenuItem key={setting} onClick={handleCloseUserMenu}>
									<Typography textAlign="center">{setting}</Typography>
								</MenuItem>
							))}
						</Menu>
					</Box>}
			</Toolbar>
		</AppBar>
  );
};