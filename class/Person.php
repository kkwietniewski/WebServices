<?php
class User{
    public $name;
    public $surname;
    public $age;
    public $height;


    public function setName($value){
        $this->name = $value;
    }
    public function setSurname($surname){
        $this->surname = $surname;
    }
    public function setAge($age){
        $this->age = $age;
    }
    public function setHeight($height){
        $this->height = $height;
    }
    public function getProperties(){
        $this->setName('Jon');
        $this->setSurname('Snow');
        $this->setAge('23');
        $this->setHeight('173');

    }
    public function getData(){
        $data = <<<DATA
            Dane: <br><br>
            Imie: $this->name <br>
            Nazwisko: $this->surname <br>
            Wiek: $this->age lat <br>
            Wzrost: $this->height cm <br>
        DATA;
        return $data;
    }

}
    //Dodaj metode umozliwiajaca ustawienie wszystkich skladowych (imie nazwisko)

    //Dodaj do klasy mozliwosc dodania wieku oraz wzrostu

    //Utworz metode ktora zwroci wszystkie dane w formacie 
    // Dane:
    // Imię: ...
    // Naziwsko: ...
    // Wiek: ... lat
    // Wzrost: ... cm

?>