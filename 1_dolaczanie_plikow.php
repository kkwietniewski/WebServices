
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
</head>
<body>
    <h3>Początek pliku</h3>
        <?php
            include './1_file.php';
            include_once './1_file.php';


            require './1_file.php';
            require_once './1_file.php';

        ?>
    <h3>Koniec pliku</h3>
</body>
</html>