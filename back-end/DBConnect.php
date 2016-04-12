<?php
final class DBConnect
{
    private static $_instance = null;

    private function __construct() {}

    public static function getInstance()
    {
        $dbConfig = array(
            'database' => '',
            'host' => '',
            'username' => '',
            'password' => ''
        );
        if(static::$_instance == null)
        {
            static::$_instance = new mysqli($dbConfig['host'],$dbConfig['username'], $dbConfig['password'], $dbConfig['database']);
            if (static::$_instance->connect_errno)
            {
                return false;
            }
        }
        return static::$_instance;
    }
}

