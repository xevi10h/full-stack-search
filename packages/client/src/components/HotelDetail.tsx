import { getCodeSandboxHost } from '@codesandbox/utils';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import tryhackme_logo from '../../public/tryhackme_logo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';

type Hotel = {
	_id: string;
	chain_name: string;
	hotel_name: string;
	city: string;
	country: string;
};

const codeSandboxHost = getCodeSandboxHost(3001);
const API_URL = codeSandboxHost
	? `https://${codeSandboxHost}`
	: 'http://localhost:3001';

const HotelDetail = () => {
	const { id } = useParams<{ id: string }>();
	const [hotel, setHotel] = useState<Hotel | null>(null);

	useEffect(() => {
		const fetchHotel = async () => {
			try {
				const response = await fetch(`${API_URL}/hotels/${id}`);
				const data = await response.json();
				setHotel(data);
			} catch (error) {
				console.error('Error fetching hotel:', error);
			}
		};

		fetchHotel();
	}, [id]);

	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="bg-white shadow-lg rounded-lg p-6 max-w-md gap-x-10">
				{!hotel ? (
					<div>Loading...</div>
				) : (
					<>
						<div className="flex items-center justify-between mb-4">
							<FontAwesomeIcon
								icon={faBuilding}
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
								<h2 className="text-2xl font-bold mb-2">{hotel.hotel_name}</h2>
								<p className="text-gray-600 mb-1">{hotel.chain_name}</p>
								<p className="text-gray-600">{`${hotel.city}, ${hotel.country}`}</p>
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

export default HotelDetail;
