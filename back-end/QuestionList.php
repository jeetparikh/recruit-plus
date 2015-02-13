<?php
require_once('RecruitAbstract.php');
class QuestionList extends RecruitAbstract
{
    private $_table = 'QuestionList';

    function add($name)
    {

        if($this->_connectionObject) {
            $insert = $this->_connectionObject->prepare("INSERT INTO `grouplist`(name) VALUES(?)");
            $insert->bind_param('s', $name);
            $insert->execute();
            $insert->close();
        }
        else {
            return false;
        }
    }

    function getAllQuestions($typeId = null, array $levelIds = array(), $start = 1, $perPage = 20)
    {
        $resp = array();
        $whereAdded = false;
        
        $query = "SELECT q.*, qt.type, ql.level  from ". $this->_table . " as q INNER JOIN `QuestionType` as qt ON q.questionTypeId = qt.id INNER JOIN `QuestionLevel` as ql ON q.levelId = ql.id";

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

    function updateUserCount($groupId) {
        if(empty($groupId)) {
            throw new Exception('Invalid');
        }
        $result = $this->_connectionObject->query("SELECT `userCount` from `grouplist` where `id` = $groupId");
        $count = mysqli_fetch_assoc($result);
        $count = $count['userCount'];
        $update = $this->_connectionObject->prepare("UPDATE `grouplist` set userCount = ? where `id` = ?");
        $count += 1;
        $update->bind_param('ii', $count, $groupId);
        $update->execute();
        $update->close();
    }
}