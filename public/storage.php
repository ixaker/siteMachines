<?php
    // Подключение к базе данных
    $host = 'os284542.mysql.tools'; // Измените на хост вашего хостинга
    $dbname = 'os284542_machines';
    $user = 'os284542_machines';
    $password = 't@&bZ8H5s4';

    // Параметры для работы с хранилищем
    $storageHost = 'a7b85a942d4082eb.cdn.express';
    $storageUsername = 'machines';
    $storagePassword = 'SJts24y24K';
    $storageToken = null; // Глобальный токен

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        die("Ошибка подключения к базе данных: " . $e->getMessage());
    }

    // Функция для выполнения базового CURL-запроса
    function performCurlRequest($endpoint, $headers, $params, $isMultipart = false) {
        global $storageHost; // Используем глобальную переменную $storageHost
        $apiUrl = 'https://' . $storageHost . $endpoint;

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $apiUrl);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_POST, true);
        curl_setopt($curl, CURLOPT_POSTFIELDS, $isMultipart ? $params : http_build_query($params));
        curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

        $response = curl_exec($curl);
        curl_close($curl);

        return json_decode($response, true);
    }

    // Функция для выполнения запросов к хранилищу
    function executeCurlRequest($endpoint, $headers, $params, $isMultipart = false) {
        global $storageToken; // Используем глобальные переменные

        if (empty($storageToken)) {
            // Получаем токен, если он ещё не установлен
            $storageToken = getStorageToken();
            if (empty($storageToken)) {
                die("Ошибка авторизации: невозможно получить токен.");
            }
        }

        $authHeader = "Authorization: Bearer $storageToken";
        $headers = array_merge([$authHeader], $headers);

        return performCurlRequest($endpoint, $headers, $params, $isMultipart);
    }

    // Авторизация в хранилище
    function getStorageToken() {
        global $storageUsername, $storagePassword; // Используем глобальные переменные
        $endpoint = '/~/action/storage/auth/login/';
        $headers = ['Content-Type: application/json'];
        $params = ['username' => $storageUsername, 'password' => $storagePassword];

        // Выполняем запрос без токена
        return performCurlRequest($endpoint, $headers, json_encode($params), true)['callback']['token'] ?? null;
    }

    function createStorageFolder($path) {
        $endpoint = '/~/action/storage/folder/create';
        $headers = ["Content-Type: application/x-www-form-urlencoded"];
        $params = ['path' => $path, 'public' => false];

        $response = executeCurlRequest($endpoint, $headers, $params);
        return isset($response['success']) && $response['success'] === true;
    }

    function uploadToStorage($path, $localFilePath) {
        $endpoint = '/~/action/storage/upload';
        $headers = ["Content-Type: multipart/form-data"];
        $params = [
            'path' => $path,
            'file' => new CURLFile($localFilePath)
        ];

        $response = executeCurlRequest($endpoint, $headers, $params, true);
        return isset($response['success']) && $response['success'] === true;
    }
            
    // Функции для работы с машинами
    function addMachine($pdo, $data) {
        $stmt = $pdo->prepare("INSERT INTO machines (data) VALUES (?)");
        $stmt->execute([$data]);
        return $pdo->lastInsertId();
    }

    function updateMachine($pdo, $id, $data) {
        $stmt = $pdo->prepare("UPDATE machines SET data = ? WHERE id = ?");
        $stmt->execute([$data, $id]);
        return $id;
    }

    function deleteMachine($pdo, $id) {
        $stmt = $pdo->prepare("DELETE FROM machines WHERE id = ?");
        $stmt->execute([$id]);
    }

    function getMachine($pdo, $id) {
        $stmt = $pdo->prepare("SELECT * FROM machines WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    function getMachines($pdo) {
        $stmt = $pdo->query("SELECT * FROM machines");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Функция для возврата JSON ответа
    function sendJsonResponse($data, $statusCode = 200) {
        header('Content-Type: application/json');
        http_response_code($statusCode);
        echo json_encode($data);
        exit;
    }

    // Обработка запросов
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            if (isset($_GET['id'])) {
                $response = getMachine($pdo, $_GET['id']);
            } else {
                $response = getMachines($pdo);
            }
            sendJsonResponse($response);
            break;

        case 'POST':
            $data = $_POST['data'];
            $id = $_POST['id'];
            if (!empty($data)) {
                if (!isset($id)) {
                    $machineId = addMachine($pdo, $data);
                } else {
                    $machineId = updateMachine($pdo, $id, $data);
                }
                
                sendJsonResponse(["id" => $machineId]);
            } else {
                sendJsonResponse(["error" => "Invalid data"], 400);
            }
            break;

        case 'DELETE':
            parse_str(file_get_contents('php://input'), $data);
            if (!empty($data['id'])) {
                deleteMachine($pdo, $data['id']);
                sendJsonResponse(null, 204); // Успешное удаление
            } else {
                sendJsonResponse(["error" => "Invalid data"], 400); // Некорректные данные
            }
            break;

        default:
            sendJsonResponse(["error" => "Method not allowed"], 405);
            break;
    }
?>
