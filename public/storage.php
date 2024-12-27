<?php
    // Подключение к базе данных
    $host = 'os284542.mysql.tools'; // Измените на хост вашего хостинга
    $dbname = 'os284542_machines';
    $user = 'os284542_machines';
    $password = 't@&bZ8H5s4';

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
        die("Ошибка подключения к базе данных: " . $e->getMessage());
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

    // Обработка запросов
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_POST['action'])) {
            $action = $_POST['action'];

            if ($action === 'add') {
                $data = $_POST['data'];
                $machineId = addMachine($pdo, $data);

            } elseif ($action === 'update') {
                $id = $_POST['id'];
                $data = $_POST['data'];
                updateMachine($pdo, $id, $data);

            } elseif ($action === 'delete') {
                $id = $_POST['id'];
                deleteMachine($pdo, $id);

            } elseif ($action === 'get') {
                $id = $_POST['id'];
                getMachine($pdo, $id);

            } elseif ($action === 'getAll') {
                getMachines($pdo);
            }

            header("Location: {$_SERVER['PHP_SELF']}");
            exit;
        }
    }

    $machines = getMachines($pdo);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Управление машинами</title>
</head>
<body>
    <h1>Список машин</h1>
    <table border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>Данные</th>
                <th>Действия</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($machines as $machine): ?>
                <tr>
                    <td><?= htmlspecialchars($machine['id']) ?></td>
                    <td><?= htmlspecialchars($machine['data']) ?></td>
                    <td>
                        <form method="post" style="display:inline;">
                            <input type="hidden" name="id" value="<?= $machine['id'] ?>">
                            <input type="hidden" name="action" value="delete">
                            <button type="submit">Удалить</button>
                        </form>
                        <form method="post" action="update.php" style="display:inline;">
                            <input type="hidden" name="id" value="<?= $machine['id'] ?>">
                            <button type="submit">Изменить</button>
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <h2>Добавить машину</h2>
    <form method="post">
        <input type="hidden" name="action" value="add">
        <label>Данные: <textarea name="data" required></textarea></label><br>
        <button type="submit">Добавить</button>
    </form>
</body>
</html>
