# Library Management System

This is an ASP.NET Core MVC application for managing a library's book collection, implemented as part of the midterm activity requirements.

## Features Implemented

### Part 1: Add Book Functionality ✅
- **User Interface**: Complete form for adding new books with validation
- **BookService Logic**: `CreateBookAsync` method implemented to save books to database
- **BookController**: `[HttpPost] Add` action implemented with proper model validation
- **Redirect on Success**: Users are redirected to book list page after successful creation

### Part 2: Delete Book Functionality ✅
- **Service Implementation**: `DeleteBookAsync` method implemented in BookService
- **Controller Action**: `[HttpDelete] Delete` action returns proper Ok/NotFound responses
- **Cascade Delete**: Book copies are automatically deleted when a book is deleted

### Part 3: Add Book Copies Functionality ✅
- **BookCopy Entity**: Implemented with CoverImageUrl, Condition, and Source properties
- **Modal Interface**: Users can add book copies via modal from book details page (no redirection)
- **Form Fields**: Modal includes all required fields (CoverImageUrl, Condition, Source)
- **Service Method**: `AddBookCopyAsync` method implemented in BookService
- **Navigation**: Accessible from book details page as requested

## Project Structure

```
librarymanagement/
├── Controllers/
│   ├── BookController.cs       # Main controller with all CRUD operations
│   └── HomeController.cs       # Home page controller
├── Data/
│   └── LibraryDbContext.cs     # Entity Framework DbContext
├── Models/
│   ├── Book.cs                 # Book entity model
│   ├── BookCopy.cs             # BookCopy entity model
│   ├── AddBookViewModel.cs     # ViewModel for adding books
│   ├── AddBookCopyViewModel.cs # ViewModel for adding book copies
│   └── ErrorViewModel.cs       # Error handling model
├── Services/
│   ├── IBookService.cs         # Service interface
│   └── BookService.cs          # Service implementation
└── Views/
    ├── Book/
    │   ├── Index.cshtml         # Book listing page
    │   ├── Add.cshtml           # Add book form
    │   └── Details.cshtml       # Book details with copy management
    ├── Home/
    │   └── Index.cshtml         # Updated home page
    └── Shared/
        └── _Layout.cshtml       # Updated layout with navigation

```

## Database Schema

### Books Table
- `Id` (Primary Key)
- `Title` (Required, Max 200 chars)
- `Author` (Required, Max 100 chars)
- `ISBN` (Optional, Max 13 chars)
- `Genre` (Optional, Max 50 chars)
- `PublicationDate` (Required)
- `Publisher` (Optional, Max 100 chars)
- `Description` (Optional)
- `CreatedAt`, `UpdatedAt`

### BookCopies Table
- `Id` (Primary Key)
- `BookId` (Foreign Key to Books)
- `CoverImageUrl` (Optional, Max 200 chars)
- `Condition` (Required, Max 50 chars)
- `Source` (Optional, Max 100 chars)
- `IsAvailable` (Boolean, default true)
- `CreatedAt`

## Key Implementation Details

1. **Entity Relationships**: One-to-Many relationship between Book and BookCopy with cascade delete
2. **Validation**: Comprehensive client and server-side validation using Data Annotations
3. **Modal UI**: Book copy addition uses Bootstrap modal as specified (no redirection)
4. **AJAX Operations**: Delete and Add Copy operations use AJAX for better user experience
5. **Responsive Design**: Bootstrap-based responsive UI with FontAwesome icons

## Running the Application

1. Ensure you have .NET 8.0 installed
2. Run `dotnet restore` to restore NuGet packages
3. Run `dotnet ef database update` to create the database
4. Run `dotnet run` to start the application
5. Navigate to the Books section to begin managing your library

## Technologies Used

- ASP.NET Core MVC 8.0
- Entity Framework Core 8.0
- SQL Server LocalDB
- Bootstrap 5
- FontAwesome Icons
- jQuery for AJAX operations
