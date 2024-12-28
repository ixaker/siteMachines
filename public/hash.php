<?php

// Проверяем, передан ли параметр password через GET
// http://localhost/generate_hash.php?password=my_secure_password

if (isset($_GET['password'])) {
    // Получаем пароль из GET-запроса
    $password = $_GET['password'];

    // Генерируем хэш пароля с использованием PASSWORD_BCRYPT
    $hash = password_hash($password, PASSWORD_BCRYPT);

    // Отображаем сгенерированный хэш
    echo "Введённый пароль: " . htmlspecialchars($password) . "<br>";
    echo "Сгенерированный хэш: " . $hash;
} else {
    // Если параметр не передан, показываем инструкцию
    echo "Используйте этот скрипт, передав пароль через GET-запрос.<br>";
    echo "Пример: ?password=your_password";
}
?>