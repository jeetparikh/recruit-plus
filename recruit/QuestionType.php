<?php
require_once('RecruitAbstract.php');
class QuestionType extends RecruitAbstract
{
    private $_table = 'QuestionType';

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