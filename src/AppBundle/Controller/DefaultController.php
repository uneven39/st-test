<?php

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class DefaultController extends Controller
{
    /**
     * @Route("/", name="homepage")
     */
    public function indexAction(Request $request)
    {
        // replace this example code with whatever you need
        return $this->render('default/index.html.twig', [
            'base_dir' => realpath($this->getParameter('kernel.project_dir')).DIRECTORY_SEPARATOR,
        ]);
    }

    /**
     * @Route("/employees/", name="employees")
     * @param Request $request
     * @return JsonResponse
     */
    public function getEmployeesListAction(Request $request)
    {
        // get list of employees
        if ($request->getMethod() === 'GET' )  {
            $data = file_get_contents($this->getParameter('web_dir').'/data/employees.json');
            $json_arr = json_decode($data, true);
            return new JsonResponse(array('data' => $json_arr));
        }
    }

    /**
     * @Route("/employees/{employeeName}", name="deleteEmployee")
     * @param Request $request
     * @param $employeeName
     * @return JsonResponse
     */
    public function deleteEmployeeAction(Request $request, $employeeName)
    {
        // delete employee by name
        if ($request->getMethod() === 'DELETE' )  {
            $name = urldecode($employeeName);
            // get json data
            $data = file_get_contents($this->getParameter('web_dir').'/data/employees.json');
            $json_arr = json_decode($data, true);
            foreach ($json_arr as $key => $value)
            {
                if ($value['name'] === $name)
                {
                    $index = $key;
                    break;
                }
            }
            // delete employee
            if ($index) {
                unset($json_arr[$index]);
            }
            // remake array
            $json_arr = array_values($json_arr);
            // encode array to json and save to file
            file_put_contents($this->getParameter('web_dir').'/data/employees.json', json_encode($json_arr, JSON_UNESCAPED_UNICODE));

            return new JsonResponse(array('data' => $json_arr));
        }
    }


}
