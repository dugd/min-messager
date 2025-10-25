<?php

namespace Database\Factories;

use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\MessageStatus>
 */
class MessageStatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $deliveredAt = fake()->optional(0.8)->dateTimeBetween('-1 week', 'now');
        $readAt = $deliveredAt ? fake()->optional(0.6)->dateTimeBetween($deliveredAt, 'now') : null;

        return [
            'message_id' => Message::factory(),
            'recipient_id' => User::factory(),
            'delivered_at' => $deliveredAt,
            'read_at' => $readAt,
        ];
    }
}
