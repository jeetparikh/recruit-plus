<?php
require_once('DBConnect.php');
class QuestionList
{
    private $_connectionObject;

    private $_table = 'questionList';

    function __construct()
    {
        if(!$this->_connectionObject) {
            $this->_connectionObject = DBConnect::getInstance();
        }
    }

    function getAllQuestions($typeId = null, array $levelIds = array(), $start = 1, $perPage = 20)
    {
        $resp = array();
        $whereAdded = false;
        
        $query = "SELECT q.*, qt.type, ql.level  from ". $this->_table . " as q INNER JOIN `questionType` as qt ON
        q.questionTypeId = qt.id INNER JOIN `questionLevel` as ql ON q.levelId = ql.id";

        if(!empty($typeId)) {
            $whereAdded = true;
            $query .= ' where q.questionTypeId = '. $typeId;
        }
        
        if(!empty($levelIds)) {
            if(!$whereAdded) {
                $query .= ' where (q.levelId = ';
            }else {
                $query .= ' AND (q.levelId = ';
            }

            $query .= implode(' OR q.levelId = ', $levelIds);
            $query .= ')';
        }



        $questions = $this->_connectionObject->query($query);

        if($questions) {
            while($question = $questions->fetch_assoc()) {
                $resp[$question['id']] = $question;
            }
        }
        return $resp;
    }
}