<?php

namespace AppBundle\Entity;

use Symfony\Component\Validator\Constraints as Assert;

class Employee
{
    /**
     * @Assert\NotBlank()
     */
    public $name;

    /**
     * @Assert\NotBlank()
     */
    public $position;

    /**
     * @Assert\GreaterThan(
     *     value = 17
     * )
     */
    public $age;

    /**
     * @Assert\Choice(
     *     choices = { "мужчина", "женщина" },
     *     message = "Choose a valid gender"
     * )
     */
    public $gender;

    public function __construct($name, $position, $age, $gender)
    {
        $this->name = $name;
        $this->position = $position;
        $this->age = $age;
        $this->gender = $gender;
    }

}