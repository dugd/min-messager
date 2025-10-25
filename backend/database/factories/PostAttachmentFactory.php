<?php

namespace Database\Factories;

use App\Models\Post;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PostAttachment>
 */
class PostAttachmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'post_id' => Post::factory(),
            'url' => fake()->imageUrl(800, 600),
            'mime' => 'image/jpeg',
            'size_bytes' => fake()->numberBetween(50000, 8000000),
        ];
    }
}
