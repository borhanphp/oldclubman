# Marketplace Fields Reference

This document outlines the fields used for different marketplace listing types.

## Common Fields (Used in Both Vehicle & Home)

| Field | Description | Type | Example |
|-------|-------------|------|---------|
| `title` | Listing title | String | "Phone" or "2020 Apple iPhone 12" |
| `price` | Price of the item | Number | 20000 |
| `description` | Detailed description | Text | "This is good phone" |
| `category_id` | Category identifier | Number | 1 |
| `condition` | Item condition | Number | 1 (New), 2 (Used - Like New), 3 (Used - Good), 4 (Used - Fair) |
| `availability` | Stock availability | Number | 1 (In Stock), 2 (Available to Order), 3 (Out of Stock) |
| `sku` | Stock Keeping Unit | String | "SK001" |
| `country_id` | Country identifier | Number | 1 |
| `state_id` | State identifier | Number | 1 |
| `city_id` | City identifier | Number | 1 |
| `public_meetup` | Allow public meetup | Boolean | 1 or 0 |
| `door_pickup` | Allow door pickup | Boolean | 1 or 0 |
| `door_dropoff` | Allow door dropoff | Boolean | 1 or 0 |
| `hide_from_friends` | Hide from friends list | Boolean | 0 or 1 |
| `status` | Listing status | Number | 1 (Active) |
| `published_at` | Publication date | Date | "2025-11-01" |
| `unpublished_at` | Unpublish date | Date | "2025-11-05" |
| `tags` | Comma-separated tags | String | "Phone,Good Phone,I Phone" |

## Vehicle-Specific Fields

Used in: `/app/marketplace/create/vehicle/page.js`

| Field | Description | Type | Example |
|-------|-------------|------|---------|
| `vehicle_type` | Type of vehicle | Number | 1 (Car), 2 (Truck), 3 (Motorcycle), 4 (SUV), 5 (Van), 6 (Bus), 7 (Other) |
| `year` | Manufacturing year | Number | 2020 |
| `make` | Vehicle manufacturer | String | "Apple" |
| `model` | Vehicle model | String | "iPhone 12" |

### Vehicle Form Fields

The vehicle form includes:
- Photo upload (up to 20 photos)
- Vehicle type dropdown
- Year dropdown (current year to 1950)
- Make input field
- Model input field
- Price input
- Description textarea
- Condition dropdown
- Availability dropdown
- SKU input (optional)
- Tags input (optional)
- Delivery & Meetup options (Public Meetup, Door Pickup, Door Dropoff)
- Privacy options (Hide from Friends)

## Home/Property-Specific Fields

Used in: `/app/marketplace/create/property/page.js`

| Field | Description | Type | Example |
|-------|-------------|------|---------|
| `rental_type` | Type of rental property | Number | 1 (Apartment), 2 (House), 3 (Condo), 4 (Townhouse), 5 (Studio), 6 (Room), 7 (Other) |
| `number_of_bedrooms` | Number of bedrooms | Number | 1 |
| `number_of_bathrooms` | Number of bathrooms | Number | 1 |
| `price_per_month` | Monthly rental price | Number | 1000 |
| `property_square_feet` | Property size in sq ft | Number | 1000 |
| `date_available` | Date property is available | Date | "2025-11-01" |
| `laundry_type` | Type of laundry facility | Number | 1 (In unit), 2 (Shared), 3 (None), 4 (Hookups available) |
| `parking_type` | Type of parking | Number | 1 (Garage), 2 (Driveway), 3 (Street), 4 (Covered), 5 (None) |
| `air_conditioning_type` | AC type | Number | 1 (Central), 2 (Window), 3 (None) |
| `heating_type` | Heating type | Number | 1 (Central), 2 (Electric), 3 (Gas), 4 (Oil), 5 (None) |
| `cat_friendly` | Cat-friendly property | Boolean | 1 or 0 |
| `dog_friendly` | Dog-friendly property | Boolean | 1 or 0 |

### Property Form Fields

The property form includes:
- Photo upload (up to 50 photos)
- Rental type dropdown
- Number of bedrooms input
- Number of bathrooms input
- Price per month input
- Location display (from profile)
- Rental description textarea
- Advanced Details section:
  - Property square feet
  - Date available (date picker)
  - Laundry type dropdown
  - Parking type dropdown
  - Air conditioning type dropdown
  - Heating type dropdown
  - Cat friendly toggle
  - Dog friendly toggle
- Condition dropdown
- Availability dropdown
- SKU input (optional)
- Tags input (optional)
- Viewing & Handover options (Public Meetup, Key Pickup, Key Delivery)
- Privacy options (Hide from Friends)

## API Endpoint

Both forms submit to: `POST /sale_post/store`

Data is sent as `multipart/form-data` to support image uploads.

## Notes

- All numeric fields (IDs, types) are sent as strings in the form data
- Boolean fields are converted to "1" or "0" before submission
- Images are appended to form data as `files[]` (array format)
- Location data (country_id, state_id, city_id) is automatically retrieved from user's profile
- Title is auto-generated from key fields if not explicitly provided
- Vehicle listings use `type: "2"`
- Property/Home listings use `type: "3"`
- Item listings use `type: "1"`

