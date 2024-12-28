
<?php
// Хэш заранее известного пароля
$storedHash = '$2y$10$vCddfHT9K5KtkXh7OQpMaeKdhAsxyDQ6r0WNa9zG07J3uWcIwDn3y'; // test

// Стартуем сессию для защиты и удобного хранения данных
session_start();

// Проверяем, был ли отправлен POST-запрос
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $inputPassword = $_GET['password'] ?? '';

    // Сравниваем введённый пароль с сохранённым хэшем
    if (password_verify($inputPassword, $storedHash)) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'success']);
        
    } else {
        // Неверный пароль
        header('Content-Type: application/json');
        http_response_code(401); // Код ответа "Unauthorized"
        echo json_encode(['status' => 'error', 'message' => 'Неверный пароль!']);
    }
} else {
    // Если не GET-запрос, возвращаем ошибку
    header('Content-Type: application/json');
    http_response_code(405); // Код ответа "Method Not Allowed"
    echo json_encode(['status' => 'error', 'message' => 'Используйте только GET-запрос.']);
}