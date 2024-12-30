<?php

    // Загружаем настройки из secret.php
    define('SECURE_ACCESS', true); // Определяем ключ для доступа к secret.php
    $config = require __DIR__ . '/secret.php';

    $storedHash = password_hash($config['auth_pass'], PASSWORD_DEFAULT); // test
    
    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $inputPassword = $_GET['password'] ?? '';

        if (password_verify($inputPassword, $storedHash)) {
            header('X-Auth-Token: ' . $config['secretKey']);

            echo json_encode([
                'status' => 'success',
                'message' => 'Пароль верный'
            ]);
        } else {
            http_response_code(401);
            echo json_encode([
                'status' => 'error',
                'message' => 'Неверный пароль'
            ]);
        }
    } else {
        http_response_code(405);
        echo json_encode([
            'status' => 'error',
            'message' => 'Используйте только GET-запрос'
        ]);
    }
?>
