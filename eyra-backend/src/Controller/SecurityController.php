<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Este controlador solo existe para exponer la ruta, el código nunca se ejecuta
 * porque el firewall json_login intercepta la solicitud antes.
 */
class SecurityController extends AbstractController
{
    /**
     * Esta ruta es manejada por el firewall json_login en security.yaml
     * Este método nunca se ejecuta, solo registra la ruta en el router de Symfony
     */
    #[Route('/api/login', name: 'api_login_check', methods: ['POST'])]
    public function apiLoginCheck(): Response
    {
        // Este código nunca se ejecutará porque el firewall json_login
        // interceptará la solicitud antes de llegar aquí
        throw new \LogicException('Este código nunca debería ejecutarse.');
    }
}
