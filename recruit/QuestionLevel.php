<?php
require_once('RecruitAbstract.php');
class QuestionLevel extends RecruitAbstract
{
    private $_table = 'QuestionLevel';

    function getAllquestionLevels()
    {
        $resp = array();

        $query = "SELECT * from ". $this->_table;
        $questionLevels = $this->_connectionObject->query($query);
        $resp['totalCount'] = $questionLevels->num_rows;

        if($questionLevels) {
            while($questionLevel = $questionLevels->fetch_assoc()) {
                $resp['levels'][$questionLevel['id']] = $questionLevel;
            }
        }
        return $resp;
    }
}