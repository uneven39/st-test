<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Employee;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Class EmployeeController
 * @Route("/employees")
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
        $data = file_get_contents($this->get('kernel')->getRootDir() . '/../web/data/employees.json');
        $json_arr = json_decode($data, true);
        return new JsonResponse(array('data' => $json_arr));
    }

    /**
     * Get record about employee by id
     * @Route("/{employeeId}")
     * @Method("GET")
     * @param $employeeId
     * @return JsonResponse $response
     */
    public function getEmployeeByIdAction($employeeId)
    {
        // get json data
        $data = file_get_contents($this->get('kernel')->getRootDir().'/../web/data/employees.json');
        $json_arr = json_decode($data, true);
        $found = '';
        foreach ($json_arr as $key => $value)
        {
            if ($value['id'] === $employeeId)
            {
                $found = $value;
                break;
            }
        }
        $response = new JsonResponse();

        if ($found) {
            $response->setStatusCode(200);
            $response->setData(array('data' => $found));
        } else {
            $response->setStatusCode(404);
            $response->setData(array('errors' => array($employeeId => 'not found')));
        }

        return $response;
    }

    /**
     * Create employee
     * @Route("/")
     * @Method("POST")
     * @param Request $request
     * @return JsonResponse
     */
    public function createEmployeeAction(Request $request)
    {
        $input = json_decode($request->getContent(), true);

        $employee = new Employee(
            uniqid(),
            $input['name'],
            $input['position'],
            $input['age'],
            $input['gender']
        );
        $validator = $this->get('validator');

        $errors = $validator->validate($employee);

        $response = new JsonResponse();
        $response->headers->set('Content-Type', 'application-json; charset=utf8' );

        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            $response->setData(array('errors' => $errorsString, 'data' => $employee));
            $response->setStatusCode(400);
            return $response;
        }

        $data = file_get_contents($this->get('kernel')->getRootDir() . '/../web/data/employees.json');

        // decode json
        $json_arr = json_decode($data, true);

        // add data
        $json_arr[] = array(
            'id'=>$employee->id,
            'name'=>$employee->name,
            'age'=>$employee->age,
            'position'=>$employee->position,
            'gender'=>$employee->gender
        );

        // encode json and save to file
        $updatedData = json_encode($json_arr, JSON_UNESCAPED_UNICODE);
        file_put_contents($this->get('kernel')->getRootDir() . '/../web/data/employees.json', $updatedData);

        $response->setData(array('data' => $employee));
        $response->setStatusCode(200);
        return $response;
    }

    /**
     * Delete record about employee by name
     * @Route("/{employeeId}")
     * @Method("DELETE")
     * @param $employeeId
     * @return JsonResponse
     */
    public function deleteEmployeeByNameAction($employeeId)
    {
        // get json data
        $data = file_get_contents($this->get('kernel')->getRootDir() . '/../web/data/employees.json');
        $json_arr = json_decode($data, true);
        $index = -1;
        foreach ($json_arr as $key => $value)
        {
            if ($value['id'] === $employeeId)
            {
                $index = $key;
                break;
            }
        }
        $response = new JsonResponse();

        if ($index >= 0) {
            // delete employee
            unset($json_arr[$index]);
            // remake array
            $json_arr = array_values($json_arr);
            // encode array to json and save to file
            $updatedData = json_encode($json_arr, JSON_UNESCAPED_UNICODE);
            file_put_contents($this->get('kernel')->getRootDir() . '/../web/data/employees.json', $updatedData);
            $response->setStatusCode(200);
            $response->setData(array('data' => array($employeeId => 'deleted')));
        } else {
            $response->setStatusCode(404);
            $response->setData(array('errors' => array($employeeId => 'not found')));
        }

        return $response;
    }

    /**
     * Update employee data by name
     * @Route("/{employeeId}")
     * @Method("PUT")
     * @param Request $request
     * @param $employeeId
     * @return JsonResponse $response
     */
    public function updateEmployeeByNameAction(Request $request, $employeeId)
    {
        $input = json_decode($request->getContent(), true);

        $employee = new Employee(
            $employeeId,
            $input['name'],
            $input['position'],
            $input['age'],
            $input['gender']
        );
        $validator = $this->get('validator');
        $response = new JsonResponse();

        $errors = $validator->validate($employee);

        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            $response->setStatusCode(400);
            $response->setData(array('errors' => $errorsString, 'data' => $employee));
            return $response;
        }

        $data = file_get_contents($this->get('kernel')->getRootDir() . '/../web/data/employees.json');
        $found = '';

        // decode json
        $json_arr = json_decode($data, true);

        // add data
        foreach ($json_arr as $key => $value)
        {
            if ($value['id'] === $employeeId)
            {
                $found = $value;
                $json_arr[$key]['name'] = $employee->name;
                $json_arr[$key]['position'] = $employee->position;
                $json_arr[$key]['age'] = $employee->age;
                $json_arr[$key]['gender'] = $employee->gender;
                break;
            }
        }

        if ($found) {
            // encode json and save to file
            $updatedData = json_encode($json_arr, JSON_UNESCAPED_UNICODE);
            file_put_contents($this->get('kernel')->getRootDir() . '/../web/data/employees.json', $updatedData);
            $response->setStatusCode(200);
            $response->setData(array('data' => $employee));
            return $response;
        } else {
            $response->setStatusCode(404);
            $response->setData(array('errors' => array($employeeId => 'not found')));
            return $response;
        }
    }
}
