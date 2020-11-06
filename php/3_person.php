<?php
    require_once './class/Person.php';

    $person = new User();
    $person->getProperties();
    echo $person->getData();
?>