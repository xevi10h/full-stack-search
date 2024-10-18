import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './app';
import HotelDetail from './components/HotelDetail';
import CityDetail from './components/CityDetail';
import CountryDetail from './components/CountryDetail';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/hotels/:id" element={<HotelDetail />} />
				<Route path="/cities/:name" element={<CityDetail />} />
				<Route path="/countries/:name" element={<CountryDetail />} />
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
);
