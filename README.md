# Accommodation Search

## Technical Coding Test

This project has a simple setup with an api, hooked up to MongoDB and a frontend piece initiated with [vite](https://vitejs.dev/).

## Install and run

From the project root:

```
npm install
```

### Run

Once install has finished, you can use the following to run both the API and UI:

```
npm run start
```

### API

To run the API separately, navigate to the `./packages/api` folder

```
$ cd packages/api
```

And run the `api` server with

```
$ npm run dev
```

The API should start at http://localhost:3001

### Client

To run the `client` server separately, navigate to the `./packages/client` folder

```
$ cd ./packages/client
```

And run the `client` with

```
$ npm run start
```

The UI should start at http://localhost:3000

### Database connection & environment variables

By default, the code is set up to start and seed a MongoDB in-memory server, which should be sufficient for the test. The database URL will be logged on startup, and the seed data can be found at ./packages/api/db/seeds.

If this setup does not work for you or if you prefer to use your own MongoDB server, you can create a .env file. In the ./packages/api folder, create a .env file (or rename the existing .env.sample) and fill in the environment variables.

## Task at hand

When the project is up and running, you should see a search-bar on the screen. This one is currently hooked up to the `/hotels` endpoint.
When you type in a partial string that is part of the name of the hotel, it should appear on the screen.
Ie. type in `resort` and you should see some Hotels where the word `resort` is present.

You will also see 2 headings called **"Countries"** and **"Cities"**.

The assignment is to build a performant way to search for Hotels, Cities or Countries.
Partial searches will be fine. Hotels will need to filterable by location as well.
Ie. The search `uni` should render

- Hotels that are located in the United States, United Kingdom or have the word `uni` in the hotel name.
- Countries that have `uni` in their name Ie. United States, United Kingdom
- No Cities as there is no match

Clicking the close button within the search field should clear out the field and results.

When clicking on one of the `Hotels`, `Cities` or `Countries` links, the application should redirect to the relevant page and render the selected `Hotel`, `City` or `Country` as a heading.

### Limitations

Given the time constraints, we do not expect a fully production-ready solution. We're primarily interested in the approach and the overall quality of the solution.
Feel free to modify the current codebase as needed, including adding or removing dependencies.
For larger or more time-intensive changes, you're welcome to outline your ideas in the write-up section below and discuss them further during the call.

<img src="./assets/search-example.png" width="400px" />

### Write-up

<!-- Write-up/conclusion section -->

_When all the behaviour is implemented, feel free to add some observations or conclusions you like to share in the section_

### Database structure

#### Hotels Collection

```json
[
	{
		"chain_name": "Samed Resorts Group",
		"hotel_name": "Sai Kaew Beach Resort",
		"addressline1": "8/1 Moo 4 Tumbon Phe Muang",
		"addressline2": "",
		"zipcode": "21160",
		"city": "Koh Samet",
		"state": "Rayong",
		"country": "Thailand",
		"countryisocode": "TH",
		"star_rating": 4
	},
	{
		/* ... */
	}
]
```

#### Cities Collection

```json
[
	{ "name": "Auckland" },
	{
		/* ... */
	}
]
```

#### Countries Collection

```json
[
	{
		"country": "Belgium",
		"countryisocode": "BE"
	},
	{
		/* ... */
	}
]
```

### Changes Made

I have implemented a search functionality that allows users to efficiently and performantly search for **Hotels**, **Cities**, and **Countries**. The following changes have been made to achieve this:

- **API Search Endpoint**: Added a new `/search` endpoint in the API that accepts a query parameter `q`. This endpoint performs a case-insensitive partial search across the `hotels`, `cities`, and `countries` collections using regular expressions to find matches in relevant fields. Additionally, optimized the queries by using `Promise.all` to execute the searches in parallel, enhancing performance.

- **Detailed Endpoints for Hotels, Cities, and Countries**: Introduced new API endpoints to retrieve specific details:

  - `/hotels/:id` for fetching details of a specific hotel.
  - `/cities/:name` for fetching details of a specific city.
  - `/countries/:name` for fetching details of a specific country.

  These endpoints enable the application to display detailed information when a user clicks on a search result.

- **Frontend Updates**: Modified the frontend application to utilize the new `/search` endpoint. Implemented a user interface that displays search results categorized into **Hotels**, **Cities**, and **Countries**. As users type into the search bar, relevant results are dynamically displayed. Additionally, added functionality to clear the search results by clicking the close button.

- **Navigation and Routing**: Integrated React Router into the frontend application and added routes to handle navigation to the detailed pages of selected Hotels, Cities, and Countries. Created additional components (`HotelDetail`, `CityDetail`, `CountryDetail`) to display specific information for each entity.

- **Code Structure and Styling Improvements**: Made minor adjustments to code style and formatting for consistency, such as using single quotes and adjusting indentation. Enhanced the overall structure for better readability and maintainability.

### Running Tests

To execute the tests, use the following command:

bun test

### Future Improvements

While the current implementation meets the basic requirements, there are several enhancements that can be made to improve both the frontend and backend of the application. Below are some potential future improvements:

#### Frontend Enhancements

- **Enhanced UI/UX Design**:

  - Improve the overall user interface with a more modern and responsive design.
  - Implement accessibility features to make the application usable for all users.
  - Add animations and transitions to enhance user interactions.

- **Advanced Search Features**:

  - Implement pagination or infinite scrolling for search results to handle large datasets efficiently.
  - Add filtering and sorting options (e.g., by star rating, location, price) to allow users to refine their search results.

- **Detailed Information Pages**:

  - Expand the `HotelDetail`, `CityDetail`, and `CountryDetail` components to display more comprehensive information, such as images, reviews, and related accommodations.
  - Integrate maps to show the geographical location of hotels and cities.

- **User Authentication and Personalization**:

  - Implement user authentication to allow users to create accounts, save favorite hotels, and receive personalized recommendations.
  - Add features such as booking history and user reviews.

- **Performance Optimization**:

  - Optimize frontend performance by implementing code splitting, lazy loading, and minimizing bundle sizes.
  - Use memoization techniques to prevent unnecessary re-renders and improve component efficiency.

- **State Management**:
  - Integrate a state management library like Redux or Zustand to manage complex state across the application more effectively.

#### Backend Enhancements

- **Database Optimization**:

  - Implement indexing on frequently queried fields in MongoDB (e.g., `hotel_name`, `country`, `city`) to speed up search queries.
  - Transition from an in-memory MongoDB server to a persistent database solution for better data reliability and scalability.

- **Caching Mechanisms**:

  - Integrate caching solutions like Redis to store frequently accessed data, reducing database load and improving response times.

- **API Enhancements**:

  - Implement pagination and limit the number of results returned by the `/search` endpoint to handle large datasets efficiently.
  - Add more comprehensive error handling and validation for API endpoints to ensure robustness.

- **Security Improvements**:

  - Implement authentication and authorization mechanisms to secure API endpoints.
  - Apply rate limiting to prevent abuse and ensure fair usage of the API.
  - Sanitize and validate all incoming data to protect against injection attacks and other security vulnerabilities.

- **Logging and Monitoring**:

  - Integrate logging tools (e.g., Winston, Morgan) to track API usage and diagnose issues.
  - Set up monitoring and alerting systems to ensure the backend is running smoothly and to quickly address any downtime or performance issues.

- **Testing and Quality Assurance**:

  - Expand the test suite to include more comprehensive unit, integration, and end-to-end tests.
  - Implement continuous integration (CI) pipelines to automate testing and deployment processes.

- **Scalability and Deployment**:

  - Containerize the application using Docker to simplify deployment and scaling.
  - Deploy the application to cloud platforms (e.g., AWS, Heroku, Vercel) with proper scaling configurations to handle increased traffic.

- **Documentation and API Standards**:
  - Enhance API documentation using tools like Swagger or Postman to provide clear guidelines for future developers and integrations.
  - Adhere to API standards and best practices to ensure consistency and ease of use.

Implementing these improvements will not only enhance the functionality and performance of the application but also provide a better user experience and ensure the system is robust and scalable for future growth.
