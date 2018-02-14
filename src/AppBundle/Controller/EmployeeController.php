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
        $data = file_get_contents($this->getParameter('web_dir').'data/employees.json');
        $json_arr = json_decode($data, true);
        return new JsonResponse(array('data' => $json_arr, 'url' => $this->getParameter('web_dir').'data/employees.json'));
    }

    /**
     * Get record about employee by name
     * @Route("/{employeeName}")
     * @Method("GET")
     * @param $employeeName
     * @return JsonResponse $response
     */
    public function getEmployeeByNameAction($employeeName)
    {
        $name = urldecode($employeeName);
        // get json data
        $data = file_get_contents($this->getParameter('web_dir').'/data/employees.json');
        $json_arr = json_decode($data, true);
        $found = '';
        foreach ($json_arr as $key => $value)
        {
            if ($value['name'] === $name)
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
            $response->setData(array('errors' => array($name => 'not found')));
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
        $input = $request->request;
        $employee = new Employee(
            $input->get('name'),
            $input->get('position'),
            $input->get('age'),
            $input->get('gender')
        );
        $validator = $this->get('validator');

        $errors = $validator->validate($employee);

        if (count($errors) > 0) {
            $errorsString = (string) $errors;
            return new JsonResponse(array('errors' => $errorsString, 'data' => $employee));
        }

        $data = file_get_contents($this->getParameter('web_dir').'/data/employees.json');

        // decode json
        $json_arr = json_decode($data, true);

        // add data
        $json_arr[] = array(
            'name'=>$employee->name,
            'age'=>$employee->age,
            'position'=>$employee->position,
            'gender'=>$employee->gender
        );

        // encode json and save to file
        $updatedData = json_encode($json_arr, JSON_UNESCAPED_UNICODE);
        file_put_contents($this->getParameter('web_dir').'/data/employees.json', $updatedData);

        return new JsonResponse(array('data' => $employee));
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
            $updatedData = json_encode($json_arr, JSON_UNESCAPED_UNICODE);
            file_put_contents($this->getParameter('web_dir').'/data/employees.json', $updatedData);
            $response->setStatusCode(200);
            $response->setData(array('data' => array($name => 'deleted')));
        } else {
            $response->setStatusCode(404);
            $response->setData(array('errors' => array($name => 'not found')));
        }

        return $response;
    }

    /**
     * Update employee data by name
     * @Route("/{employeeName}")
     * @Method("PUT")
     * @param Request $request
     * @param $employeeName
     * @return JsonResponse $response
     */
    public function updateEmployeeByNameAction(Request $request, $employeeName)
    {
        $name = urlencode($employeeName);
        $input = $request->request;
        $employee = new Employee(
            $name,
            $input->get('position'),
            $input->get('age'),
            $input->get('gender')
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

        $data = file_get_contents($this->getParameter('web_dir').'/data/employees.json');
        $found = '';

        // decode json
        $json_arr = json_decode($data, true);

        // add data
        foreach ($json_arr as $key => $value)
        {
            if ($value['name'] === $name)
            {
                $found = $value;
                $json_arr[$key]['position'] = $employee->position;
                $json_arr[$key]['age'] = $employee->age;
                $json_arr[$key]['gender'] = $employee->gender;
                break;
            }
        }

        if ($found) {
            // encode json and save to file
            $updatedData = json_encode($json_arr, JSON_UNESCAPED_UNICODE);
            file_put_contents($this->getParameter('web_dir').'/data/employees.json', $updatedData);
            $response->setStatusCode(200);
            $response->setData(array('data' => $employee));
            return $response;
        } else {
            $response->setStatusCode(404);
            $response->setData(array('errors' => array($name => 'not found')));
            return $response;
        }
    }
}
