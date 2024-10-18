import { useState, useEffect, type ChangeEvent } from 'react';
import { getCodeSandboxHost } from '@codesandbox/utils';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faLocationDot,
	faBuilding,
	faGlobe,
} from '@fortawesome/free-solid-svg-icons';

type Hotel = {
	_id: string;
	chain_name: string;
	hotel_name: string;
	city: string;
	country: string;
};

type City = {
	name: string;
};

type Country = {
	country: string;
	countryisocode: string;
};

type SearchResults = {
	hotels: Hotel[];
	cities: City[];
	countries: Country[];
};

const codeSandboxHost = getCodeSandboxHost(3001);
const API_URL = codeSandboxHost
	? `https://${codeSandboxHost}`
	: 'http://localhost:3001';

const fetchAndFilterResults = async (value: string): Promise<SearchResults> => {
	const response = await fetch(
		`${API_URL}/search?q=${encodeURIComponent(value)}`,
	);
	const data = await response.json();
	return data;
};

function App() {
	const [isEmptySearch, setIsEmptySearch] = useState(true);
	const [textSearch, setTextSearch] = useState('');
	const [results, setResults] = useState<SearchResults>({
		hotels: [],
		cities: [],
		countries: [],
	});

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setTextSearch(event.target.value);
	};

	useEffect(() => {
		const handler = setTimeout(() => {
			if (textSearch === '') {
				setResults({ hotels: [], cities: [], countries: [] });
				setIsEmptySearch(true);
			} else {
				fetchAndFilterResults(textSearch)
					.then((data) => {
						setResults(data);
						setIsEmptySearch(false);
					})
					.catch((error) => {
						console.error('Error fetching search results:', error);
					});
			}
		}, 300);

		return () => {
			clearTimeout(handler);
		};
	}, [textSearch]);

	const clearSearch = () => {
		setResults({ hotels: [], cities: [], countries: [] });
		setTextSearch('');
		setIsEmptySearch(true);
	};

	return (
		<div className="App">
			<div className="container">
				<div className="row height d-flex justify-content-center align-items-center">
					<div className="col-md-6">
						<div className="dropdown">
							<div className="form">
								<i className="fa fa-search"></i>
								<input
									type="text"
									className="form-control form-input"
									placeholder="Search accommodation..."
									value={textSearch}
									onChange={handleChange}
								/>
								{!isEmptySearch && (
									<span className="left-pan" onClick={clearSearch}>
										<i className="fa fa-close"></i>
									</span>
								)}
							</div>
							{!isEmptySearch && (
								<div className="search-dropdown-menu dropdown-menu w-100 show p-2">
									<>
										<h2 className="font-semibold text-xl mb-2">Hotels</h2>
										{results.hotels.length > 0 ? (
											results.hotels.map((hotel) => (
												<li key={hotel._id}>
													<Link
														to={`/hotels/${hotel._id}`}
														className="dropdown-item"
													>
														<FontAwesomeIcon
															icon={faBuilding}
															className="mr-2"
														/>
														{hotel.hotel_name}
													</Link>
													<hr className="divider" />
												</li>
											))
										) : (
											<p>No hotels matched</p>
										)}
									</>
									<>
										<h2 className="font-semibold text-xl mb-2">Countries</h2>
										{results.countries.length > 0 ? (
											results.countries.map((country) => (
												<li key={country.countryisocode}>
													<Link
														to={`/countries/${country.countryisocode}`}
														className="dropdown-item"
													>
														<FontAwesomeIcon icon={faGlobe} className="mr-2" />
														{country.country}
													</Link>
													<hr className="divider" />
												</li>
											))
										) : (
											<p className="mb-4 dropdown-item">No countries matched</p>
										)}
									</>
									<>
										<h2 className="font-semibold text-xl mb-2">Cities</h2>
										{results.cities.length > 0 ? (
											results.cities.map((city) => (
												<li key={city.name}>
													<Link
														to={`/cities/${city.name}`}
														className="dropdown-item"
													>
														<FontAwesomeIcon
															icon={faLocationDot}
															className="mr-2"
														/>
														{city.name}
													</Link>
													<hr className="divider" />
												</li>
											))
										) : (
											<p>No cities matched</p>
										)}
									</>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
