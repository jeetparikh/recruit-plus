<?php
require_once('RecruitAbstract.php');
class CandidateDetails extends RecruitAbstract
{
    private $_table = 'CandidateDetails';

    function addDetails(array $candidateDetails, array $scoreDetails)
    {
        $candidateId = -1;
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

            if($insert->execute()) {
                $candidateId = $insert->insert_id;
            }

            $insert->close();
            return $candidateId;
        }
        else {
            return false;
        }
    }

    function getAllCandidates() {
        $resp = array();

        $query = "SELECT * from ". $this->_table . " ORDER BY `dateAdded` DESC";
        $candidates = $this->_connectionObject->query($query);
        if($candidates) {
            while($candidate = $candidates->fetch_assoc()) {
                $resp[$candidate['id']] = $candidate;
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