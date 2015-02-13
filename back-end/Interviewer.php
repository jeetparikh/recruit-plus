<?php
require_once('RecruitAbstract.php');
class Interviewer extends RecruitAbstract
{
    private $_table = 'CandidateDetails';

    /**
     * Returns the list of candidates who have taken the test
     *
     */
    function fetchInterviewerDetails() {
        $resp = array();
        $query = "SELECT * from ". $this->_table . " ORDER BY `dateAdded` DESC";
        $interviewers = $this->_connectionObject->query($query);
        if($interviewers) {
            while($interviewer = $interviewers->fetch_assoc()) {
                $resp[$interviewer['id']] = $interviewer;
            }
        }
        return $resp;
    }


}
