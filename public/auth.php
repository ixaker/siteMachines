<?php

// Загружаем настройки из secret.php
define('SECURE_ACCESS', true); // Определяем ключ для доступа к secret.php
$config = require __DIR__ . '/secret.php';

// Получаем сохранённый хэш пароля и секретный токен из конфигурации
$storedHash = password_hash($config['auth_pass'], PASSWORD_DEFAULT); // test
$secretKey = $config['secretKey'];

// Устанавливаем заголовок ответа как JSON
header('Content-Type: application/json');

// Обработка GET-запроса
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $inputPassword = $_GET['password'] ?? '';

    // Проверяем введённый пароль
    if (password_verify($inputPassword, $storedHash)) {
        // Добавляем токен в заголовок ответа
        header('X-Auth-Token: ' . $secretKey);

        echo json_encode([
            'status' => 'success',
            'message' => 'Пароль верный'
        ]);
    } else {
        http_response_code(401); // Код ошибки "Unauthorized"
        echo json_encode([
            'status' => 'error',
            'message' => 'Неверный пароль'
        ]);
    }
    exit; // Завершаем выполнение после обработки GET-запроса
}

// Обработка POST-запроса
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['token'] ?? '';

    // Проверяем токен
    if ($token === $secretKey) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Токен верный'
        ]);
    } else {
        http_response_code(401); // Код ошибки "Unauthorized"
        echo json_encode([
            'status' => 'error',
            'message' => 'Неверный токен'
        ]);
    }
    exit; // Завершаем выполнение после обработки POST-запроса
}

// Если метод запроса не поддерживается
http_response_code(405); // Код ошибки "Method Not Allowed"
echo json_encode([
    'status' => 'error',
    'message' => 'Метод запроса не поддерживается'
]);
?>
