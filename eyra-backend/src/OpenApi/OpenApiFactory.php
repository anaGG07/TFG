<?php

namespace App\OpenApi;

use ApiPlatform\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\OpenApi\OpenApi;
use ApiPlatform\OpenApi\Model;

class OpenApiFactory implements OpenApiFactoryInterface
{
    public function __construct(
        private OpenApiFactoryInterface $decorated,
        private string $apiDescription,
        private array $apiServers
    ) {
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = $this->decorated->__invoke($context);
        
        // Personaliza la información de la API
        $openApi = $openApi->withInfo(
            $openApi->getInfo()->withDescription($this->apiDescription)
        );
        
        // Configurar servidores
        $servers = [];
        foreach ($this->apiServers as $server) {
            $servers[] = new Model\Server($server['url'], $server['description']);
        }
        $openApi = $openApi->withServers($servers);
        
        // Añadir seguridad con JWT
        $securitySchemes = $openApi->getComponents()->getSecuritySchemes() ?: new \ArrayObject();
        $securitySchemes['bearerAuth'] = new \ArrayObject([
            'type' => 'http',
            'scheme' => 'bearer',
            'bearerFormat' => 'JWT',
            'description' => 'Valor del token JWT recibido al hacer login'
        ]);
        
        // Añadir requisito de autenticación global
        $openApi = $openApi->withSecurity([[
            'bearerAuth' => []
        ]]);
        
        // Personalizar documentación de los endpoints de autenticación
        $this->customizeAuthEndpoints($openApi);
        
        return $openApi;
    }
    
    private function customizeAuthEndpoints(OpenApi $openApi): void
    {
        $paths = $openApi->getPaths();
        
        // Añadir docuemntación para login
        $loginOperation = new Model\Operation(
            'postLogin', 
            ['Auth'], 
            [
                '200' => [
                    'description' => 'Login exitoso',
                    'content' => [
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'token' => ['type' => 'string'],
                                    'refreshToken' => ['type' => 'string'],
                                    'expiresAt' => ['type' => 'string', 'format' => 'date-time']
                                ]
                            ]
                        ]
                    ]
                ],
                '401' => [
                    'description' => 'Credenciales inválidas'
                ]
            ],
            'Iniciar sesión para obtener token JWT',
            'Iniciar sesión con correo y contraseña',
            null,
            [],
            new Model\RequestBody(
                'Credenciales de usuario',
                new \ArrayObject([
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                            'properties' => [
                                'email' => ['type' => 'string', 'format' => 'email'],
                                'password' => ['type' => 'string', 'format' => 'password']
                            ],
                            'required' => ['email', 'password']
                        ]
                    ]
                ])
            )
        );
        
        $loginPathItem = new Model\PathItem(null, null, null, null, null, $loginOperation);
        $paths->addPath('/api/login', $loginPathItem);
        
        // Añadir documentación para registro
        $registerOperation = new Model\Operation(
            'postRegister', 
            ['Auth'], 
            [
                '201' => [
                    'description' => 'Usuario registrado correctamente'
                ],
                '400' => [
                    'description' => 'Datos de registro inválidos'
                ]
            ],
            'Registro de nuevo usuario',
            'Crear una nueva cuenta de usuario',
            null,
            [],
            new Model\RequestBody(
                'Datos de usuario',
                new \ArrayObject([
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                            'properties' => [
                                'email' => ['type' => 'string', 'format' => 'email'],
                                'password' => ['type' => 'string', 'format' => 'password'],
                                'username' => ['type' => 'string'],
                                'name' => ['type' => 'string'],
                                'lastName' => ['type' => 'string'],
                                'genderIdentity' => ['type' => 'string'],
                                'birthDate' => ['type' => 'string', 'format' => 'date']
                            ],
                            'required' => ['email', 'password', 'username', 'name', 'lastName', 'birthDate']
                        ]
                    ]
                ])
            )
        );
        
        $registerPathItem = new Model\PathItem(null, null, null, null, null, $registerOperation);
        $paths->addPath('/api/register', $registerPathItem);
        
        // Añadir documentación para refresh token
        $refreshOperation = new Model\Operation(
            'postRefreshToken', 
            ['Auth'], 
            [
                '200' => [
                    'description' => 'Tokens renovados correctamente',
                    'content' => [
                        'application/json' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'token' => ['type' => 'string'],
                                    'refreshToken' => ['type' => 'string'],
                                    'expiresAt' => ['type' => 'string', 'format' => 'date-time']
                                ]
                            ]
                        ]
                    ]
                ],
                '401' => [
                    'description' => 'Token de refresco inválido o expirado'
                ]
            ],
            'Renovar tokens de autenticación',
            'Obtener un nuevo token JWT usando un refresh token',
            null,
            [],
            new Model\RequestBody(
                'Refresh Token',
                new \ArrayObject([
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                            'properties' => [
                                'refreshToken' => ['type' => 'string']
                            ],
                            'required' => ['refreshToken']
                        ]
                    ]
                ])
            )
        );
        
        $refreshPathItem = new Model\PathItem(null, null, null, null, null, $refreshOperation);
        $paths->addPath('/api/refresh-token', $refreshPathItem);
    }
}
