<?php
require_once('RecruitAbstract.php');
class CandidateDetails extends RecruitAbstract
{
    private $_table = 'CandidateDetails';

    function add(array $candidateDetails, array $scoreDetails)
    {
        if($this->_connectionObject) {
            $insertQuery = "INSERT INTO `CandidateDetails`(`email`, `name`, `interviewer`, `isTestTaken`, `scoreDetails`, `totalScore`, `position`) VALUES(?,?,?,?,?,?,?)";

            $insert = $this->_connectionObject->prepare($insertQuery);

            $name = $candidateDetails['name'];
            $email = $candidateDetails['email'];
            $position = $candidateDetails['position'];
            $interviewer = $candidateDetails['interviewer'];            
            $isTestTaken = 1; // set this attribute to one since the test is conducted now
            $score = json_encode($scoreDetails);
            $totalScore = $scoreDetails['totalScore'];            

            $insert->bind_param('sssisis', $email, $name, $interviewer, $isTestTaken, $score, $totalScore, $position);
//            $insert->bind_param('s', $name);
//            $insert->bind_param('s', $interviewer);
//            $insert->bind_param('i', $isTestTaken);
//            $insert->bind_param('s', $score);
//            $insert->bind_param('i', $totalScore);
//            $insert->bind_param('s', $position);

            $insert->execute();
            $insert->close();
        }
        else {
            return false;
        }
    }

    /**
     * Returns the list of candidates who have taken the test
     * @return bool
     */
    function fetchCandidates(){
        if($this->_connectionObject) {
            $selectQuery = "SELECT * FROM `CandidateDetails` WHERE `isTestTaken` = 1";

            $select = $this->_connectionObject->prepare($selectQuery);
            $select->execute();
            $select->close();
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