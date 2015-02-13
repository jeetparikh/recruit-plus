<?php
require_once('Interviewer.php');
$interviewer = new Interviewer();
$resp = array();
$resp['candidateList'] = $interviewer->fetchInterviewerDetails();
$resp = json_encode($resp);
echo $_REQUEST['callback'].'('.$resp.')';

