<?php

namespace AppBundle\Entity;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Context\ExecutionContextInterface;

/**
 * Class Employee
 */
class Employee
{
    /**
     * @Assert\NotBlank()
     */
    public $id;
    /**
     * @Assert\NotBlank()
     */
    public $name;

    /**
     * @Assert\NotBlank()
     */
    public $position;

//    /**
//     * @Assert\GreaterThan(
//     *     value = 17
//     * )
//     */
    public $age;

    /**
     * @Assert\Choice(
     *     choices = { "m", "f", "" },
     *     message = "Choose a valid gender"
     * )
     */
    public $gender;

    public function __construct($id, $name, $position, $age, $gender)
    {
        $this->id = $id;
        $this->name = $name;
        $this->position = $position;
        $this->age = $age;
        $this->gender = $gender;
    }

    /**
     * Assert\Callback
     */
    public function isAgeValid(ExecutionContextInterface $context)
    {
        if ($this->age !== null && $this->age < 18) {
            $context->buildViolation('Age error')
                ->atPath('age')
                ->addViolation();
        }
    }
}