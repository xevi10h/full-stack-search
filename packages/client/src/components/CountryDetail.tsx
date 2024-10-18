import { getCodeSandboxHost } from '@codesandbox/utils';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import tryhackme_logo from '../../public/tryhackme_logo.png';
import { ArrowLeft } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

type Country = {
	country: string;
	countryisocode: string;
};

const codeSandboxHost = getCodeSandboxHost(3001);
const API_URL = codeSandboxHost
	? `https://${codeSandboxHost}`
	: 'http://localhost:3001';

const CountryDetail = () => {
	const { name } = useParams<{ name: string }>();
	const [country, setCountry] = useState<Country | null>(null);

	useEffect(() => {
		const fetchCountry = async () => {
			try {
				const response = await fetch(
					`${API_URL}/countries/${encodeURIComponent(name || '')}`,
				);
				const data = await response.json();
				setCountry(data);
			} catch (error) {
				console.error('Error fetching country:', error);
			}
		};

		fetchCountry();
	}, [name]);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="bg-white shadow-lg rounded-lg p-6 max-w-md gap-x-10">
				{!country ? (
					<div>Loading...</div>
				) : (
					<>
						<div className="flex items-center justify-between mb-4">
							<FontAwesomeIcon
								icon={faGlobe}
								className="w-12 h-12 text-blue-600"
							/>
							<button
								onClick={() => window.history.back()}
								className="flex items-center text-blue-600 hover:text-blue-800"
							>
								<ArrowLeft className="w-4 h-4 mr-1" />
								Back to Search
							</button>
						</div>
						<div className="flex items-center justify-between ">
							<span>
								<h2 className="text-2xl font-bold mb-2">{`${country.country} (${country.countryisocode})`}</h2>
							</span>
							<img
								src={tryhackme_logo}
								alt="TryHackMe logo"
								className="w-12 ml-12"
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default CountryDetail;
