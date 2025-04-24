
# Laravel Backend Setup Instructions

## Installation Commands
```bash
# Create new Laravel project
composer create-project laravel/laravel travel-planner

# Install Laravel Breeze with API support
composer require laravel/breeze --dev
php artisan breeze:install api

# Install Laravel Sanctum
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Install dependencies and build
composer install
npm install
npm run build

# Generate app key
php artisan key:generate

# Create the database migrations
php artisan make:migration create_users_table
php artisan make:migration create_trips_table
php artisan make:migration create_activities_table
php artisan make:migration create_trip_participants_table

# Create models
php artisan make:model Trip
php artisan make:model Activity
php artisan make:model TripParticipant

# Create controllers
php artisan make:controller Api/TripController --api
php artisan make:controller Api/ActivityController --api
php artisan make:controller Api/ProfileController --api

# Run migrations
php artisan migrate
```

