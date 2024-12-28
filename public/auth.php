<?php

$storedHash = '$2y$10$vCddfHT9K5KtkXh7OQpMaeKdhAsxyDQ6r0WNa9zG07J3uWcIwDn3y'; // test

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $inputPassword = $_GET['password'] ?? '';

    if (password_verify($inputPassword, $storedHash)) {
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
