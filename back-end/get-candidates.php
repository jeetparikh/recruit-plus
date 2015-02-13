<?php
require_once('CandidateDetails.php');
require_once('QuestionType.php');

$candidate = new CandidateDetails();
$type = new QuestionType();
$resp = array();
$resp['candidateList'] = $candidate->getAllCandidates();
$resp['questionTypes'] = $type->getAllQuestionTypes();
$resp = json_encode($resp);
echo $_REQUEST['callback'].'('.$resp.')';