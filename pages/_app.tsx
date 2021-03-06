
import { Box, createTheme, CssBaseline, ThemeProvider, Toolbar } from '@mui/material';
import type { AppProps } from 'next/app'
import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function MyApp({ Component, pageProps }: AppProps) {
	const drawerWidth = 240;
	const prevent = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.preventDefault();
	const [size, setSize] = useState('0 Bytes');

	return (
    <ThemeProvider theme={darkTheme}>
			<Box sx={{ display: 'flex' }} onContextMenu={prevent}>
				<CssBaseline />
				<Header />
				<Sidebar
					size={size}
					setSize={setSize} />
				<Box sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
					<Toolbar />
					<Component
						{...pageProps}
						size={size}
						setSize={setSize} />
				</Box>
			</Box>
    </ThemeProvider>
	)
}

export default MyApp
