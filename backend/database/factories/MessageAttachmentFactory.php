<?php

namespace Database\Factories;

use App\Models\Message;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MessageAttachment>
 */
class MessageAttachmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'message_id' => Message::factory(),
            'kind' => 'image',
            'url' => fake()->imageUrl(640, 480),
            'mime' => 'image/jpeg',
            'size_bytes' => fake()->numberBetween(10000, 5000000),
        ];
    }
}
