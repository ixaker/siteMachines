<?php
define('SECURE_ACCESS', true);
$config = require __DIR__ . '/secret.php';

// Получаем сохранённый хэш пароля и секретный токен из конфигурации
$storedHash = password_hash($config['auth_pass'], PASSWORD_DEFAULT); // test
$secretKey = $config['secretKey'];

// Параметры базы данных
$host = $config['db_host'];
$dbname = $config['db_name'];
$user = $config['db_user'];
$password = $config['db_pass'];

// Имя таблицы
$tableName = 'type';

// Проверка токена
function validateToken($expectedToken) {
    // Получаем все заголовки запроса
    $headers = getallheaders();

    // Проверяем наличие заголовка Authorization
    if (!isset($headers['Authorization'])) {
        return false;
    }

    // Извлекаем токен из заголовка
    list($type, $token) = explode(' ', $headers['Authorization'], 2);

    // Проверяем, что заголовок соответствует ожидаемому формату и значению токена
    return $type === 'Bearer' && $token === $expectedToken;
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(["error" => "Ошибка подключения к базе данных: " . $e->getMessage()]));
}

// Проверка наличия таблицы и её создание при необходимости
try {
    $stmt = $pdo->query("SHOW TABLES LIKE '$tableName'");
    if ($stmt->rowCount() === 0) {
        // Таблица не существует, создаём её
        $pdo->exec("
            CREATE TABLE $tableName (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                characteristics JSON NULL DEFAULT NULL
            )
        ");
    }
} catch (PDOException $e) {
    http_response_code(500);
    die(json_encode(["error" => "Ошибка при проверке или создании таблицы: " . $e->getMessage()]));
}

// Установка заголовков для ответа
header('Content-Type: application/json');

// Определение метода запроса
$method = $_SERVER['REQUEST_METHOD'];

// Получение данных запроса
parse_str(file_get_contents('php://input'), $input);

$id = isset($_GET['id']) ? intval($_GET['id']) : null;

if ($method === 'POST') {
    if (!validateToken($secretKey)) {
        http_response_code(403);
        exit('Access denied');
    }
    // Для POST запросов данные могут быть в $_POST
    $id = isset($_POST['id']) ? intval($_POST['id']) : null;
    $name = isset($_POST['name']) ? trim($_POST['name']) : null;
    $characteristics = isset($_POST['characteristics']) ? $_POST['characteristics'] : null;
    
    // Проверяем, является ли переданный JSON строкой, если нет - конвертируем
    if ($characteristics && !is_string($characteristics)) {
        $characteristics = json_encode($characteristics);
    }
}

switch ($method) {
    case 'GET': {
        try {
            if ($id) {
                // Получение строки по id
                $stmt = $pdo->prepare("SELECT * FROM $tableName WHERE id = :id");
                $stmt->execute(['id' => $id]);
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($result) {
                    // Декодирование JSON-поля
                    $result['characteristics'] = $result['characteristics'] ? json_decode($result['characteristics'], true) : null;
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        $result['characteristics'] = null; // Если декодирование JSON завершилось ошибкой
                    }
                    echo json_encode($result);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Запись не найдена']);
                }
            } else {
                // Получение всех строк
                $stmt = $pdo->query("SELECT * FROM $tableName");
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($result as &$row) {
                    $row['characteristics'] = $row['characteristics'] ? json_decode($row['characteristics'], true) : null;
                    if (json_last_error() !== JSON_ERROR_NONE) {
                        $row['characteristics'] = null;
                    }
                }
                echo json_encode($result);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка выполнения запроса: ' . $e->getMessage()]);
        }
        break;
    }

    case 'POST': {
        try {
            if ($id) {
                // Обновление строки по id
                if ($name || $characteristics) {
                    $fields = [];
                    $params = ['id' => $id];
                    if ($name) {
                        $fields[] = 'name = :name';
                        $params['name'] = $name;
                    }
                    if ($characteristics) {
                        $fields[] = 'characteristics = :characteristics';
                        $params['characteristics'] = $characteristics;
                    }
                    $stmt = $pdo->prepare("UPDATE $tableName SET " . implode(', ', $fields) . " WHERE id = :id");
                    $stmt->execute($params);
                    echo json_encode(['message' => 'Запись обновлена']);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Не указано значение name или characteristics']);
                }
            } else {
                // Создание новой строки
                if ($name) {
                    $stmt = $pdo->prepare("INSERT INTO $tableName (name, characteristics) VALUES (:name, :characteristics)");
                    $stmt->execute([
                        'name' => $name,
                        'characteristics' => $characteristics ?: null
                    ]);
                    echo json_encode(['message' => 'Запись добавлена', 'id' => $pdo->lastInsertId()]);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Не указано значение name']);
                }
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка выполнения запроса: ' . $e->getMessage()]);
        }
        break;
    }

    case 'DELETE': {
        try {
            if ($id) {
                // Удаление строки по id
                $stmt = $pdo->prepare("DELETE FROM $tableName WHERE id = :id");
                $stmt->execute(['id' => $id]);
                echo json_encode(['message' => 'Запись удалена']);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Не указан параметр id']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка выполнения запроса: ' . $e->getMessage()]);
        }
        break;
    }

    default: {
        http_response_code(405);
        echo json_encode(['error' => 'Неподдерживаемый метод запроса']);
        break;
    }
}

?>
