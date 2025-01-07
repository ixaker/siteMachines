<?php
// Параметры базы данных
$host = 'os284542.mysql.tools';
$dbname = 'os284542_machines';
$user = 'os284542_machines';
$password = 't@&bZ8H5s4';

// Имя таблицы
$tableName = 'type';

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
                name VARCHAR(255) NOT NULL
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
    // Для POST запросов данные могут быть в $_POST
    $id = isset($_POST['id']) ? intval($_POST['id']) : null;
    $name = isset($_POST['name']) ? trim($_POST['name']) : null;
}

switch ($method) {
    case 'GET':
        try {
            if ($id) {
                // Получение строки по id
                $stmt = $pdo->prepare("SELECT * FROM $tableName WHERE id = :id");
                $stmt->execute(['id' => $id]);
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($result) {
                    echo json_encode($result);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Запись не найдена']);
                }
            } else {
                // Получение всех строк
                $stmt = $pdo->query("SELECT * FROM $tableName");
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($result);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Ошибка выполнения запроса: ' . $e->getMessage()]);
        }
        break;

    case 'POST':
        try {
            if ($id) {
                // Обновление строки по id
                if ($name) {
                    $stmt = $pdo->prepare("UPDATE $tableName SET name = :name WHERE id = :id");
                    $stmt->execute(['name' => $name, 'id' => $id]);
                    echo json_encode(['message' => 'Запись обновлена']);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => 'Не указано значение name']);
                }
            } else {
                // Создание новой строки
                if ($name) {
                    $stmt = $pdo->prepare("INSERT INTO $tableName (name) VALUES (:name)");
                    $stmt->execute(['name' => $name]);
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

    case 'DELETE':
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

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Неподдерживаемый метод запроса']);
}
?>
