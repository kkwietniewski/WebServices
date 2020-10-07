<?php
    class User{
        public $name;
        public $surname;
        public $color;
        public function setName($value){
            $this->name = $value;
        }
        public function showData(){                echo <<<SHOW
            Some data...<br><br>
        SHOW;
        }
        public function setSurnameAndColor($surname, $color){
            $this->surname = $surname;
            $this->color = $color;
        }
        public function getData(){
            $data = <<<DATA
                Dane: <br><br>
                Imie: $this->name <br>
                Nazwisko: $this->surname <br>
                Kolor: $this->color <br>
            DATA;
            return $data;
        }
    }
    $user1 = new User();

    $user1->setName('Anna');
    echo $user1->showData();
    $user1->setSurnameAndColor('Kowalska','Black');
    echo $user1->getData();


    //napisać metode wyswietlajaca dane w heredoc
    //metode ustawiajaca nazwisko oraz kolor
    //napisac metode wyswietlajaca wszystkie wlasciwosci


?>