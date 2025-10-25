<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create test users with various profiles
        User::factory()->create([
            'name' => 'John Doe',
            'username' => 'johndoe',
            'email' => 'john@example.com',
            'avatar_url' => 'https://i.pravatar.cc/200?img=1',
            'bio' => 'Software developer and tech enthusiast. Love coding and coffee!',
            'visibility' => 'public',
        ]);

        User::factory()->create([
            'name' => 'Jane Smith',
            'username' => 'janesmith',
            'email' => 'jane@example.com',
            'avatar_url' => 'https://i.pravatar.cc/200?img=2',
            'bio' => 'Designer and creative thinker. Passionate about UX/UI.',
            'visibility' => 'public',
        ]);

        User::factory()->create([
            'name' => 'Alice Johnson',
            'username' => 'alicejohnson',
            'email' => 'alice@example.com',
            'avatar_url' => 'https://i.pravatar.cc/200?img=3',
            'bio' => 'Digital marketer. Always exploring new strategies.',
            'visibility' => 'private',
        ]);

        User::factory()->create([
            'name' => 'Bob Williams',
            'username' => 'bobwilliams',
            'email' => 'bob@example.com',
            'avatar_url' => 'https://i.pravatar.cc/200?img=4',
            'bio' => null,
            'visibility' => 'public',
        ]);

        User::factory()->create([
            'name' => 'Charlie Brown',
            'username' => 'charliebrown',
            'email' => 'charlie@example.com',
            'avatar_url' => null,
            'bio' => 'Product manager with 5+ years of experience.',
            'visibility' => 'public',
        ]);

        // Create additional random users
        User::factory(15)->create();
    }
}
