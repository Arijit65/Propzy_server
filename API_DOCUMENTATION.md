# Property API Documentation

## Base URL
```
http://localhost:5000/api/features
```

## Authentication
All endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## Endpoints

### 1. Create Property
**POST** `/properties/create`

Creates a new property listing.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body (Form Data):**

```javascript
{
  // Step 1: Basic Details
  "purpose": "Sell",                              // Enum: "Sell", "Rent / Lease", "PG"
  "propertyType": "Residential",                  // Enum: "Residential", "Commercial"
  "propertySubType": "Independent House / Villa", // String

  // Step 2: Location Details
  "city": "Kolkata South",                        // String (required)
  "locality": "Goragacha",                        // String (required)
  "subLocality": "",                              // String (optional)
  "apartment": "",                                // String (optional)

  // Step 3: Property Profile
  "bedrooms": "2",                                // String
  "bathrooms": "2",                               // String
  "balconies": "1",                               // String
  "plotArea": "12000",                            // String
  "areaUnit": "sq.ft.",                           // String: "sq.ft.", "sq.m.", "sq.yards"
  "carpetArea": "",                               // String (optional)
  "builtUpArea": "",                              // String (optional)
  "totalFloors": "2",                             // String
  "availabilityStatus": "Ready to move",          // Enum: "Ready to move", "Under construction"
  "propertyAge": "1-5 years",                     // String
  "ownership": "Freehold",                        // String
  "expectedPrice": "5000000",                     // String
  "pricePerSqFt": "416",                          // String
  "allInclusivePrice": false,                     // Boolean
  "taxExcluded": false,                           // Boolean
  "priceNegotiable": false,                       // Boolean
  "propertyDescription": "Well maintained...",    // Text

  // Step 4: Photos & Videos
  "photos": [File, File, ...],                    // Array of image files (max 20)
  "video": File,                                  // Video file (optional)

  // Step 5: Amenities
  "otherRooms": ["Pooja Room", "Study Room"],     // JSON Array
  "furnishing": "Furnished",                      // String
  "coveredParking": 1,                            // Integer
  "openParking": 0,                               // Integer
  "amenities": ["Maintenance Staff", "Water Storage"], // JSON Array
  "propertyFeatures": ["High Ceiling Height"],    // JSON Array
  "societyFeatures": ["Swimming Pool", "GYM"],    // JSON Array
  "additionalFeatures": ["No open drainage"],     // JSON Array
  "waterSource": ["Municipal corporation"],       // JSON Array
  "overlooking": ["Park/Garden"],                 // JSON Array
  "otherFeatures": {                              // JSON Object
    "gatedSociety": true,
    "cornerProperty": false,
    "petFriendly": true,
    "wheelchairFriendly": false
  },
  "powerBackup": "Full",                          // Enum: "None", "Partial", "Full"
  "propertyFacing": "North",                      // String
  "flooringType": "Marble",                       // String
  "locationAdvantages": ["Close to Metro"]        // JSON Array
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Property posted successfully",
  "property": {
    "id": 1,
    "userId": 123,
    "purpose": "Sell",
    "propertyType": "Residential",
    "city": "Kolkata South",
    "locality": "Goragacha",
    "expectedPrice": "5000000",
    "photos": ["https://cloudinary.com/..."],
    "video": "https://cloudinary.com/...",
    "status": "pending",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "owner": {
      "id": 123,
      "userName": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    }
  }
}
```

---

### 2. Get All Properties
**GET** `/properties`

Retrieves all approved properties with optional filters.

**Query Parameters:**
- `purpose` (optional): Filter by purpose (Sell, Rent / Lease, PG)
- `propertyType` (optional): Filter by type (Residential, Commercial)
- `city` (optional): Filter by city
- `locality` (optional): Filter by locality
- `bedrooms` (optional): Filter by number of bedrooms
- `minPrice` (optional): Minimum price
- `maxPrice` (optional): Maximum price
- `status` (optional): Filter by status (default: "approved")

**Example:**
```
GET /properties?city=Kolkata&propertyType=Residential&bedrooms=2
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 15,
  "properties": [
    {
      "id": 1,
      "purpose": "Sell",
      "propertyType": "Residential",
      "city": "Kolkata South",
      "expectedPrice": "5000000",
      "photos": ["..."],
      "status": "approved",
      "owner": {
        "id": 123,
        "userName": "John Doe",
        "email": "john@example.com"
      }
    }
    // ... more properties
  ]
}
```

---

### 3. Get My Properties
**GET** `/properties/my`

Retrieves all properties posted by the current authenticated user.

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "properties": [
    {
      "id": 1,
      "purpose": "Sell",
      "status": "pending",
      // ... all property fields
    }
  ]
}
```

---

### 4. Get Property by ID
**GET** `/properties/:propertyId`

Retrieves a single property by its ID.

**URL Parameters:**
- `propertyId`: The ID of the property

**Success Response (200):**
```json
{
  "success": true,
  "property": {
    "id": 1,
    "userId": 123,
    "purpose": "Sell",
    // ... all property fields including amenities
    "owner": {
      "id": 123,
      "userName": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890"
    }
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "error": "Property not found"
}
```

---

### 5. Get Properties by User ID
**GET** `/properties/user/:userId`

Retrieves all properties posted by a specific user.

**URL Parameters:**
- `userId`: The ID of the user

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "properties": [
    // ... array of properties
  ]
}
```

---

### 6. Search Properties
**GET** `/properties/search`

Search properties by keyword (searches in city, locality, description, apartment name).

**Query Parameters:**
- `query` (required): Search keyword

**Example:**
```
GET /properties/search?query=Kolkata
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 8,
  "properties": [
    // ... matching properties
  ]
}
```

---

### 7. Update Property
**PUT** `/properties/:propertyId`

Updates an existing property. Only the property owner can update.

**URL Parameters:**
- `propertyId`: The ID of the property

**Request Body:**
```json
{
  "expectedPrice": "5500000",
  "priceNegotiable": true,
  "propertyDescription": "Updated description..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Property updated successfully",
  "property": {
    // ... updated property data
  }
}
```

**Error Response (403):**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

### 8. Delete Property
**DELETE** `/properties/:propertyId`

Deletes a property. Only the property owner can delete.

**URL Parameters:**
- `propertyId`: The ID of the property

**Success Response (200):**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

**Error Response (403):**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

---

## Data Models

### Property Model
```javascript
{
  id: Integer (auto-generated),
  userId: Integer (foreign key),

  // Basic Details
  purpose: Enum ["Sell", "Rent / Lease", "PG"],
  propertyType: Enum ["Residential", "Commercial"],
  propertySubType: String,

  // Location
  city: String,
  locality: String,
  subLocality: String (optional),
  apartment: String (optional),

  // Property Profile
  bedrooms: String,
  bathrooms: String,
  balconies: String,
  plotArea: String,
  areaUnit: String,
  carpetArea: String,
  builtUpArea: String,
  totalFloors: String,
  availabilityStatus: Enum ["Ready to move", "Under construction"],
  propertyAge: String,
  ownership: String,
  expectedPrice: String,
  pricePerSqFt: String,
  allInclusivePrice: Boolean,
  taxExcluded: Boolean,
  priceNegotiable: Boolean,
  propertyDescription: Text,

  // Media
  photos: Array<String> (URLs),
  video: String (URL),

  // Amenities
  otherRooms: Array<String>,
  furnishing: String,
  coveredParking: Integer,
  openParking: Integer,
  amenities: Array<String>,
  propertyFeatures: Array<String>,
  societyFeatures: Array<String>,
  additionalFeatures: Array<String>,
  waterSource: Array<String>,
  overlooking: Array<String>,
  otherFeatures: Object {
    gatedSociety: Boolean,
    cornerProperty: Boolean,
    petFriendly: Boolean,
    wheelchairFriendly: Boolean
  },
  powerBackup: Enum ["None", "Partial", "Full"],
  propertyFacing: String,
  flooringType: String,
  locationAdvantages: Array<String>,

  // Status
  status: Enum ["pending", "approved", "rejected"],
  isActive: Boolean,

  // Timestamps
  createdAt: DateTime,
  updatedAt: DateTime
}
```

---

## Error Responses

All endpoints may return these error responses:

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Property creation failed",
  "details": "Detailed error message"
}
```

---

## Testing with Postman/Thunder Client

### 1. Create Property Example

**Method:** POST
**URL:** `http://localhost:5000/api/features/properties/create`
**Headers:**
```
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data
```

**Body (form-data):**
- Add all text fields as shown in the Create Property section
- For photos: Add multiple files with key "photos"
- For video: Add file with key "video"
- For array fields (otherRooms, amenities, etc.): Send as JSON string
  ```
  otherRooms: ["Pooja Room", "Study Room"]
  ```

### 2. Get All Properties Example

**Method:** GET
**URL:** `http://localhost:5000/api/features/properties?city=Kolkata&propertyType=Residential`
**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

---

## Notes

1. **File Upload Limits:**
   - Maximum 20 photos per property
   - Maximum 1 video per property
   - Files are uploaded to Cloudinary

2. **Property Status Flow:**
   - New properties start with `status: "pending"`
   - Admin can approve/reject properties
   - Only approved properties are visible in public listings
   - Property owners can see their own properties regardless of status

3. **Array Fields:**
   - When sending array data via form-data, stringify the arrays
   - Example: `JSON.stringify(["option1", "option2"])`

4. **Authentication:**
   - All endpoints require a valid JWT token
   - Token should be obtained from the login endpoint
   - Token should be sent in Authorization header as Bearer token

5. **Database:**
   - Uses PostgreSQL with Sequelize ORM
   - Database will auto-sync on server start with `{ alter: true }`
