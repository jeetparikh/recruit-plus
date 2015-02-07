<?php
require_once('DBConnect.php');
class RecruitAbstract
{
    protected $_connectionObject;

    function __construct()
    {
        if (!$this->_connectionObject) {
            $this->_connectionObject = DBConnect::getInstance();
        }
    }
}