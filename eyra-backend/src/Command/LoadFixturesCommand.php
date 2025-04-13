<?php

namespace App\Command;

use App\Entity\Condition;
use App\Entity\Content;
use App\Entity\User;
use App\Enum\ContentType;
use App\Enum\CyclePhase;
use App\Enum\ProfileType;
use App\Service\CycleCalculatorService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:load-fixtures',
    description: 'Load initial data for development',
)]
class LoadFixturesCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
        private CycleCalculatorService $cycleCalculator
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Loading fixtures');

        try {
            // Crear usuarios
            $io->section('Creating users');
            $users = $this->createUsers($io);
            
            // Crear condiciones
            $io->section('Creating conditions');
            $conditions = $this->createConditions($io);
            
            // Crear contenido
            $io->section('Creating content');
            $content = $this->createContent($io, $conditions);
            
            // Crear ciclos menstruales
            $io->section('Creating menstrual cycles');
            foreach ($users as $user) {
                if ($user['gender'] === 'female') {
                    $this->createCycle($user['entity'], $io);
                }
            }
            
            $io->success('All fixtures loaded successfully');
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $io->error('Error loading fixtures: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }

    private function createUsers(SymfonyStyle $io): array
    {
        $users = [
            [
                'email' => 'ana@example.com',
                'password' => 'password123',
                'username' => 'ana',
                'name' => 'Ana',
                'lastName' => 'García',
                'profileType' => ProfileType::USER,
                'gender' => 'female',
                'roles' => ['ROLE_USER']
            ],
            [
                'email' => 'carlos@example.com',
                'password' => 'password123',
                'username' => 'carlos',
                'name' => 'Carlos',
                'lastName' => 'Pérez',
                'profileType' => ProfileType::USER,
                'gender' => 'male',
                'roles' => ['ROLE_USER']
            ],
            [
                'email' => 'admin@example.com',
                'password' => 'admin123',
                'username' => 'admin',
                'name' => 'Admin',
                'lastName' => 'System',
                'profileType' => ProfileType::USER,
                'gender' => 'female',
                'roles' => ['ROLE_ADMIN']
            ]
        ];

        $result = [];
        
        foreach ($users as $userData) {
            $existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $userData['email']]);
            
            if (!$existingUser) {
                $user = new User();
                $user->setEmail($userData['email']);
                $user->setUsername($userData['username']);
                $user->setName($userData['name']);
                $user->setLastName($userData['lastName']);
                $user->setProfileType($userData['profileType']);
                $user->setRoles($userData['roles']);
                $user->setGenderIdentity($userData['gender'] === 'female' ? 'mujer cis' : 'hombre cis');
                $user->setBirthDate(new \DateTime('-' . mt_rand(20, 40) . ' years'));
                
                // Hash password
                $hashedPassword = $this->passwordHasher->hashPassword($user, $userData['password']);
                $user->setPassword($hashedPassword);
                
                $this->entityManager->persist($user);
                $result[] = [
                    'entity' => $user,
                    'email' => $userData['email'],
                    'gender' => $userData['gender']
                ];
                
                $io->text("Created user: {$userData['email']}");
            } else {
                $result[] = [
                    'entity' => $existingUser,
                    'email' => $userData['email'],
                    'gender' => $userData['gender']
                ];
                
                $io->text("User already exists: {$userData['email']}");
            }
        }
        
        $this->entityManager->flush();
        return $result;
    }

    private function createConditions(SymfonyStyle $io): array
    {
        $conditions = [
            [
                'name' => 'Menstruación',
                'description' => 'Ciclo menstrual regular',
                'isChronic' => false
            ],
            [
                'name' => 'Endometriosis',
                'description' => 'Condición crónica con tejido endometrial fuera del útero',
                'isChronic' => true
            ],
            [
                'name' => 'Síndrome de Ovario Poliquístico',
                'description' => 'Desequilibrio hormonal común',
                'isChronic' => true
            ],
            [
                'name' => 'Embarazo',
                'description' => 'Gestación en curso',
                'isChronic' => false
            ],
            [
                'name' => 'Menopausia',
                'description' => 'Fin del ciclo fértil',
                'isChronic' => false
            ]
        ];
        
        $result = [];
        
        foreach ($conditions as $conditionData) {
            $existingCondition = $this->entityManager->getRepository(Condition::class)->findOneBy(['name' => $conditionData['name']]);
            
            if (!$existingCondition) {
                $condition = new Condition();
                $condition->setName($conditionData['name']);
                $condition->setDescription($conditionData['description']);
                $condition->setIsChronic($conditionData['isChronic']);
                
                $this->entityManager->persist($condition);
                $result[] = $condition;
                
                $io->text("Created condition: {$conditionData['name']}");
            } else {
                $result[] = $existingCondition;
                $io->text("Condition already exists: {$conditionData['name']}");
            }
        }
        
        $this->entityManager->flush();
        return $result;
    }

    private function createContent(SymfonyStyle $io, array $conditions): array
    {
        $content = [
            [
                'title' => 'Smoothie para fase menstrual',
                'description' => 'Bebida antioxidante y rica en hierro',
                'content' => 'Mezcla fresas, espinacas, una cucharada de linaza y leche vegetal. Esta combinación aporta hierro y antioxidantes perfectos para reponer nutrientes durante la menstruación.',
                'type' => ContentType::RECIPE,
                'phase' => CyclePhase::MENSTRUAL,
                'tags' => ['hierro', 'antioxidantes', 'energia'],
                'conditions' => [0] // Índices de las condiciones creadas anteriormente
            ],
            [
                'title' => 'Yoga suave para aliviar calambres',
                'description' => 'Secuencia de 15 minutos para dolor menstrual',
                'content' => 'Esta rutina incluye: 1. Postura de niño (3 min), 2. Torsión suave acostada (2 min por lado), 3. Piernas en la pared (5 min), 4. Respiración profunda (3 min).',
                'type' => ContentType::EXERCISE,
                'phase' => CyclePhase::MENSTRUAL,
                'tags' => ['yoga', 'dolor', 'relajación'],
                'conditions' => [0, 1] // Menstruación y Endometriosis
            ],
            [
                'title' => 'Entrenamiento HIIT fase folicular',
                'description' => 'Aprovecha tu energía en fase folicular',
                'content' => 'Este entrenamiento de 20 minutos incluye: burpees, mountain climbers, jumping jacks y sentadillas con salto. Realiza cada ejercicio por 40 segundos con 20 segundos de descanso.',
                'type' => ContentType::EXERCISE,
                'phase' => CyclePhase::FOLICULAR,
                'tags' => ['hiit', 'energía', 'cardio'],
                'conditions' => [0]
            ],
            [
                'title' => 'Ensalada energética para fase ovulatoria',
                'description' => 'Rica en antioxidantes y vitaminas',
                'content' => 'Ingredientes: espinacas, aguacate, nueces, arándanos y quinoa. Aliñar con aceite de oliva, limón y una pizca de sal marina.',
                'type' => ContentType::RECIPE,
                'phase' => CyclePhase::OVULACION,
                'tags' => ['antioxidantes', 'proteína', 'vitaminas'],
                'conditions' => [0, 2] // Menstruación y SOP
            ],
            [
                'title' => 'Meditación para fase lútea',
                'description' => 'Calma para los días premenstruales',
                'content' => 'Siéntate cómodamente, cierra los ojos y concéntrate en tu respiración. Visualiza un lugar tranquilo y seguro. Práctica durante 10 minutos cada día para reducir el estrés premenstrual.',
                'type' => ContentType::SELFCARE,
                'phase' => CyclePhase::LUTEA,
                'tags' => ['meditación', 'calma', 'ansiedad'],
                'conditions' => [0]
            ]
        ];
        
        $result = [];
        
        foreach ($content as $contentData) {
            $existingContent = $this->entityManager->getRepository(Content::class)->findOneBy(['title' => $contentData['title']]);
            
            if (!$existingContent) {
                $contentEntity = new Content();
                $contentEntity->setTitle($contentData['title']);
                $contentEntity->setDescription($contentData['description']);
                $contentEntity->setContent($contentData['content']);
                $contentEntity->setType($contentData['type']);
                $contentEntity->setTargetPhase($contentData['phase']);
                $contentEntity->setTags($contentData['tags']);
                
                // Relacionar con condiciones
                foreach ($contentData['conditions'] as $conditionIndex) {
                    if (isset($conditions[$conditionIndex])) {
                        $contentEntity->addRelatedCondition($conditions[$conditionIndex]);
                    }
                }
                
                $this->entityManager->persist($contentEntity);
                $result[] = $contentEntity;
                
                $io->text("Created content: {$contentData['title']}");
            } else {
                $result[] = $existingContent;
                $io->text("Content already exists: {$contentData['title']}");
            }
        }
        
        $this->entityManager->flush();
        return $result;
    }

    private function createCycle(User $user, SymfonyStyle $io): void
    {
        // Crear ciclo actual
        $startDate = new \DateTime('-' . mt_rand(3, 10) . ' days');
        $this->cycleCalculator->startNewCycle($user, $startDate);
        
        // Crear ciclo anterior para tener datos históricos
        $previousStartDate = (clone $startDate)->modify('-28 days');
        $previousEndDate = (clone $previousStartDate)->modify('+5 days');
        
        $io->text("Created cycles for user: {$user->getEmail()}");
    }
}
