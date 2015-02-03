<?php
require_once('DBConnect.php');
class QuestionLevel
{
    private $_connectionObject;

    private $_table = 'questionLevel';

    function __construct()
    {
        if (!$this->_connectionObject) {
            $this->_connectionObject = DBConnect::getInstance();
        }
    }

    function getAllquestionLevels()
    {
        $resp = array();

        $query = "SELECT * from ". $this->_table;
        $questionLevels = $this->_connectionObject->query($query);

        if($questionLevels) {
            while($questionLevel = $questionLevels->fetch_assoc()) {
                $resp[$questionLevel['id']] = $questionLevel;
            }
        }
        return $resp;
    }
}