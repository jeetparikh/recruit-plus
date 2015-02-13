<?php
final class DBConnect
{
    private static $_instance = null;

    private function __construct() {}

    public static function getInstance()
    {
        $dbConfig = array(
            'database' => 'ink_hiring',
            'host' => 'dev.inknowledge.net',
            'username' => 'mentis',
            'password' => 'D3v3l@dm1n'
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

