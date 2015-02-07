<?php
require_once('CandidateDetails.php');

header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

if(empty($_POST['candidateDetails']) || empty($_POST['scoreDetails'])) {
    echo json_encode(array());
    return;
}

$candidate = new CandidateDetails();
$candidate->add($_POST['candidateDetails'], $_POST['scoreDetails']);

$resp = array();

$resp = json_encode($resp);
echo $_REQUEST['callback'].'('.$resp.')';
