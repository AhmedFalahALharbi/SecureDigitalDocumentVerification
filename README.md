# Secure Digital Document Verification

This project is a web application designed to verify digital documents securely. It is built using Angular for the frontend and ASP.NET Core for the backend.

## Project Structure

- **elm-doc-verify/**: Contains the Angular frontend application.
- **ElmDocumentVerificationBackend/**: Contains the backend services for document verification.
- **SecureDigitalDocumentVerification.sln**: The solution file for the project.

## Frontend

The frontend is an Angular application located in the `elm-doc-verify` directory.

### Key Features

- Document verification form with real-time validation.
- Displays verification results including document details.
- Error handling and loading indicators.

### Scripts

- `ng serve`: Start the development server.
- `ng build`: Build the application for production.
- `ng test`: Run unit tests.
- `ng build --watch --configuration development`: Watch for changes and rebuild.
- `node dist/elm-doc-verify/server/server.mjs`: Serve the application using Node.js.

### Dependencies

- Angular 19.x
- NgRx for state management
- Bootstrap for styling
- Express for server-side rendering
- RxJS for reactive programming

### Development

To start the development server, navigate to the `elm-doc-verify` directory and run:

```bash
npm install
npm start
```

## Backend

The backend services are located in the `ElmDocumentVerificationBackend` directory. It is built using ASP.NET Core and Entity Framework Core.

### Key Features

- RESTful API for document verification.
- Database seeding and initialization.
- CORS configuration to allow requests from the Angular frontend.
- Swagger for API documentation.

### Setup

1. **Database Configuration**: The backend uses SQL Server. Update the connection string in `appsettings.json` to point to your database.

2. **Running the Backend**: Navigate to the `ElmDocumentVerificationBackend` directory and run the application using:

   ```bash
   dotnet run
   ```

3. **Swagger UI**: Access the Swagger UI for API documentation at `https://localhost:<port>/swagger` when running in development mode.

### Key Files

- `program.cs`: Configures services, middleware, and the HTTP request pipeline.
- `verification-service.cs`: Contains the logic for verifying documents.
- `verification-controller.cs`: Handles HTTP requests related to document verification.
- `db-initializer.cs`: Seeds the database with initial data.

## Installation

1. Clone the repository.
2. Navigate to the `elm-doc-verify` directory.
3. Install the dependencies using `npm install`.
4. Start the frontend server with `npm start`.
5. Navigate to the `ElmDocumentVerificationBackend` directory.
6. Run the backend server with `dotnet run`.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
