<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Conversation>
 */
class ConversationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['direct', 'group']);

        return [
            'type' => $type,
            'title' => $type === 'group' ? fake()->words(3, true) : null,
            'owner_id' => $type === 'group' ? User::factory() : null,
        ];
    }

    /**
     * Indicate that the conversation is a direct message.
     */
    public function direct(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'direct',
            'title' => null,
            'owner_id' => null,
        ]);
    }

    /**
     * Indicate that the conversation is a group chat.
     */
    public function group(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'group',
            'title' => fake()->words(3, true),
            'owner_id' => User::factory(),
        ]);
    }
}
