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

        $authHeader = "Storage-Token: $storageToken";
        $headers = array_merge([$authHeader], $headers);

        return performCurlRequest($endpoint, $headers, $params, $isMultipart);
    }

    // Авторизация в хранилище
    function getStorageToken() {
        global $storageUsername, $storagePassword; // Используем глобальные переменные
        $endpoint = '/~/action/storage/auth/login/';
        $headers = ['Content-Type: application/json'];
        $params = json_encode(['username' => $storageUsername, 'password' => $storagePassword]);

        $response = performCurlRequest($endpoint, $headers, $params, true);

        if (isset($response['callback']['token'])) {
            return $response['callback']['token'];
        }

        return null;
    }

    function createStorageFolder($machineId) {
        $endpoint = '/~/action/storage/manage/folder/';
        $headers = ["Content-Type: application/json"];
        $params = [
            'path' => '/machines', // Фиксированный путь
            'dir_name' => $machineId // Имя новой папки
        ];

        $response = executeCurlRequest($endpoint, $headers, json_encode($params), true);

        if (!isset($response['success']) || $response['success'] !== true) {
            return false;
        }

        return true;
    }

    function deleteStorageFolder($machineId) {
        $endpoint = '/~/action/storage/manage/delete/';
        $headers = ["Content-Type: application/json"];

        $params = [
            'path' => '/machines', // Фиксированный путь
            'items' => $machineId // Имя новой папки
        ];

        $response = executeCurlRequest($endpoint, $headers, json_encode($params), true);

        if (!isset($response['success']) || $response['success'] !== true) {
            return false;
        }

        return true;
    }

    function uploadToStorage($machineId, $file) {
        $endpoint = '/~/upload';
        $headers = ["Content-Type: multipart/form-data"];
        $path = "/machines/$machineId";
    
        $params = [
            'path' => $path,
            'file' => new CURLFile($file['tmp_name'], mime_content_type($file['tmp_name']), $file['name'])
        ];
    
        executeCurlRequest($endpoint, $headers, $params, true);

        return true;
    }

    // Функции для работы с машинами
    function addMachine($pdo, $data) {
        $stmt = $pdo->prepare("INSERT INTO machines (data) VALUES (?)");
        $stmt->execute([$data]);
        $lastId = $pdo->lastInsertId();
        return $lastId;
    }

    function updateMachine($pdo, $id, $data) {
        $stmt = $pdo->prepare("UPDATE machines SET data = ? WHERE id = ?");
        $stmt->execute([$data, $id]);
        return $id;
    }

    function deleteMachine($pdo, $id) {
        $stmt = $pdo->prepare("DELETE FROM machines WHERE id = ?");
        $stmt->execute([$id]);
        return $id;
    }

    function getMachine($pdo, $id) {
        $stmt = $pdo->prepare("SELECT * FROM machines WHERE id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result;
    }

    function getMachines($pdo) {
        $stmt = $pdo->query("SELECT * FROM machines");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $results;
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
                $response = ["list" => $response];
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
                    deleteStorageFolder($machineId);
                    createStorageFolder($machineId);
                }

                if (!empty($_FILES)) {

                    foreach ($_FILES as $key => $file) {
                        if ($file['error'] === UPLOAD_ERR_OK) {
                            $fileName = $file['name']; // Имя файла
                            $fileTmpPath = $file['tmp_name']; // Временный путь
                            $fileSize = $file['size']; // Размер файла
                            uploadToStorage($machineId, $file);
                        }
                    }
                }

                sendJsonResponse(["id" => $machineId]);
            } else {
                sendJsonResponse(["error" => "Invalid data"], 400);
            }
            break;

        case 'DELETE':
            if (!empty($_GET['id'])) {
                deleteMachine($pdo, $_GET['id']);
                deleteStorageFolder($_GET['id']);
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