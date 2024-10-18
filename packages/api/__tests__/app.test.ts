import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';
import app from '../index';
import { cities } from '../db/seeds/cities';
import { countries } from '../db/seeds/countries';
import { hotels } from '../db/seeds/hotels';

let mongoServer: MongoMemoryServer;
let mongoClient: MongoClient;

beforeAll(async () => {
	mongoServer = await MongoMemoryServer.create();
	const uri = mongoServer.getUri();

	process.env.DATABASE_URL = uri;

	mongoClient = new MongoClient(uri);
	await mongoClient.connect();
	const db = mongoClient.db();

	await db.collection('cities').insertMany(cities);
	await db.collection('countries').insertMany(countries);
	await db.collection('hotels').insertMany(hotels);
});

afterAll(async () => {
	if (mongoClient) await mongoClient.close();
	if (mongoServer) await mongoServer.stop();
});

describe('GET /search', () => {
	it('should return search results for query "London"', async () => {
		const response = await request(app).get('/search').query({ q: 'London' });
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('hotels');
		expect(response.body).toHaveProperty('cities');
		expect(response.body).toHaveProperty('countries');

		expect(
			response.body.cities.some((city: any) => city.name === 'London'),
		).toBeTruthy();
		expect(
			response.body.hotels.some((hotel: any) => hotel.city === 'London'),
		).toBeTruthy();
	});

	it('should return 400 if the query parameter "q" is missing', async () => {
		const response = await request(app).get('/search');
		expect(response.status).toBe(400);
		expect(response.text).toBe('Query parameter "q" is required');
	});
});

describe('GET /hotels/:id', () => {
	let hotelId: string;

	beforeAll(async () => {
		const db = mongoClient.db();
		const hotel = await db
			.collection('hotels')
			.findOne({ hotel_name: 'Amba Hotel Charing Cross' });
		if (!hotel) throw new Error('Hotel not found');
		hotelId = hotel._id.toString();
	});

	it('should return the hotel with the given id', async () => {
		const response = await request(app).get(`/hotels/${hotelId}`);
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty(
			'hotel_name',
			'Amba Hotel Charing Cross',
		);
	});

	it('should return 404 if the hotel is not found', async () => {
		const invalidId = '000000000000000000000000';
		const response = await request(app).get(`/hotels/${invalidId}`);
		expect(response.status).toBe(404);
		expect(response.text).toBe('Hotel not found');
	});
});

describe('GET /cities/:name', () => {
	it('should return the city with the given name', async () => {
		const response = await request(app).get('/cities/London');
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('name', 'London');
	});

	it('should return 404 if the city is not found', async () => {
		const response = await request(app).get('/cities/UnknownCity');
		expect(response.status).toBe(404);
		expect(response.text).toBe('City not found');
	});
});

describe('GET /countries/:name', () => {
	it('should return the country with the given name', async () => {
		const response = await request(app).get('/countries/United Kingdom');
		expect(response.status).toBe(200);
		expect(response.body).toHaveProperty('country', 'United Kingdom');
	});

	it('should return 404 if the country is not found', async () => {
		const response = await request(app).get('/countries/UnknownCountry');
		expect(response.status).toBe(404);
		expect(response.text).toBe('Country not found');
	});
});
