<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Employee;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class EmployeeController
 * @Route("/employee")
 * @package AppBundle\Controller
 */
class EmployeeController extends Controller
{
    /**
     * Get full list of employees
     * @Route("/")
     * @Method("GET")
     * @return JsonResponse
     */
    public function getEmployeesListAction()
    {
        // get list of employees
        $data = file_get_contents($this->getParameter('web_dir').'/data/employees.json');
        $json_arr = json_decode($data, true);
        return new JsonResponse(array('data' => $json_arr));
    }

    /**
     * Delete record about employee by name
     * @Route("/{employeeName}")
     * @Method("DELETE")
     * @param $employeeName
     * @return JsonResponse
     */
    public function deleteEmployeeByNameAction($employeeName)
    {
        $name = urldecode($employeeName);
        // get json data
        $data = file_get_contents($this->getParameter('web_dir').'/data/employees.json');
        $json_arr = json_decode($data, true);
        $index = '';
        foreach ($json_arr as $key => $value)
        {
            if ($value['name'] === $name)
            {
                $index = $key;
                break;
            }
        }
        $response = new JsonResponse();

        if ($index) {
            // delete employee
            unset($json_arr[$index]);
            // remake array
            $json_arr = array_values($json_arr);
            // encode array to json and save to file
            file_put_contents($this->getParameter('web_dir').'/data/employees.json', json_encode($json_arr, JSON_UNESCAPED_UNICODE));
            $response->setStatusCode(200);
            $response->setData(array($name => 'deleted'));
        } else {
            $response->setStatusCode(404);
            $response->setData(array($name => 'not found'));
        }

        return $response;
    }

    /**
     * Update employee data by name
     * @Route("/{employeeName}")
     * @Method("PUT")
     * param $request
     * param $employeeName
     * @return JsonResponse
     */
    public function updateEmployeeByNameAction(Request $request, $employeeName)
    {

    }

    /**
     * Create employee
     * @Route("/")
     * @Method("POST")
     * param $request
     * @return JsonResponse
     */
    public function createEmployeeAction(Request $request)
    {
        $employee = new Employee();
        $validator = $this->get('validator');

        $employee->name = $request->request->get('name');
        $employee->age = $request->request->get('age');
        $employee->position = $request->request->get('position');
        $employee->gender = $request->request->get('gender');

        $errors = $validator->validate($employee);

        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return new Response($errorsString);
        }

        return new Response('The employee is valid! Yes!');
    }
}
