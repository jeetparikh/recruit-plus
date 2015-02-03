<?php
require_once('DBConnect.php');
class TestDetails
{
    private $_connectionObject;

//    private $_table = 'candidate';

    function __construct()
    {
        if(!$this->_connectionObject) {
            $this->_connectionObject = DBConnect::getInstance();
        }
    }

    function addDetails($candidate, $email, $interviewee)
    {

        if($this->_connectionObject) {
            $insert = $this->_connectionObject->prepare("INSERT INTO `candidate`(name, email, interviewee) VALUES(? ? ?)");
            $insert->bind_param('sss', $candidate, $email, $interviewee);
            $insert->execute();
            $insert->close();
        }
        else {
            return false;
        }
    }
}
