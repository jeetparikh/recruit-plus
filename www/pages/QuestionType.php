<?php
require_once('DBConnect.php');
class QuestionType
{
    private $_connectionObject;

    private $_table = 'questionType';

    function __construct()
    {
        if (!$this->_connectionObject) {
            $this->_connectionObject = DBConnect::getInstance();
        }
    }

    function getAllQuestionTypes()
    {
        $resp = array();

        $query = "SELECT * from ". $this->_table;
        $questionTypes = $this->_connectionObject->query($query);

        if($questionTypes) {
            while($questionType = $questionTypes->fetch_assoc()) {
                $resp[$questionType['id']] = $questionType;
            }
        }
        return $resp;
    }
}