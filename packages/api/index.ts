import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

if (process.env.NODE_ENV !== 'production' && !process.env.DATABASE_URL) {
	await import('./db/startAndSeedMemoryDB');
}

const PORT = process.env.PORT || 3001;
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const DATABASE_URL = process.env.DATABASE_URL;

const app = express();

app.use(cors());
app.use(express.json());

app.get('/search', async (req, res) => {
	const query = req.query.q;
	if (typeof query !== 'string') {
		res.status(400).send('Query parameter "q" is required');
		return;
	}
	const mongoClient = new MongoClient(DATABASE_URL);
	try {
		await mongoClient.connect();
		const db = mongoClient.db();

		const regex = new RegExp(query, 'i');

		const hotelsPromise = db
			.collection('hotels')
			.find({
				$or: [{ hotel_name: regex }, { country: regex }, { city: regex }],
			})
			.toArray();

		const citiesPromise = db
			.collection('cities')
			.find({
				name: regex,
			})
			.toArray();

		const countriesPromise = db
			.collection('countries')
			.find({
				country: regex,
			})
			.toArray();

		// Here I used Promise.all to have a better performance => Basically we do the requests in parallel and we wait until all of them are ready
		const [hotels, cities, countries] = await Promise.all([
			hotelsPromise,
			citiesPromise,
			countriesPromise,
		]);

		res.json({ hotels, cities, countries });
	} catch (error) {
		res.status(500).send('Error en la búsqueda');
	} finally {
		await mongoClient.close();
	}
});

app.get('/hotels/:id', async (req, res) => {
	const { id } = req.params;
	const mongoClient = new MongoClient(DATABASE_URL);
	try {
		await mongoClient.connect();
		const db = mongoClient.db();
		const hotel = await db
			.collection('hotels')
			.findOne({ _id: new ObjectId(id) });
		if (hotel) {
			res.json(hotel);
		} else {
			res.status(404).send('Hotel not found');
		}
	} finally {
		await mongoClient.close();
	}
});

app.get('/cities/:name', async (req, res) => {
	const { name } = req.params;
	const mongoClient = new MongoClient(DATABASE_URL);
	try {
		await mongoClient.connect();
		const db = mongoClient.db();
		const city = await db.collection('cities').findOne({ name });
		if (city) {
			res.json(city);
		} else {
			res.status(404).send('City not found');
		}
	} finally {
		await mongoClient.close();
	}
});

app.get('/countries/:name', async (req, res) => {
	const { name } = req.params;
	const mongoClient = new MongoClient(DATABASE_URL);
	try {
		await mongoClient.connect();
		const db = mongoClient.db();
		const country = await db.collection('countries').findOne({
			$or: [{ country: name }, { countryisocode: name }],
		});
		if (country) {
			res.json(country);
		} else {
			res.status(404).send('Country not found');
		}
	} finally {
		await mongoClient.close();
	}
});

app.listen(PORT, () => {
	console.log(`API Server Started at ${PORT}`);
});

export default app;
