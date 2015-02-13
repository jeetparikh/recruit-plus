<?php
require_once('CandidateDetails.php');

header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

if(empty($_POST['candidateDetails']) || empty($_POST['scoreDetails'])) {
    echo json_encode(array());
    return;
}

$candidate = new CandidateDetails();

$resp = array(
    'candidateId' => $candidate->addDetails($_POST['candidateDetails'], $_POST['scoreDetails'])
);

echo json_encode($resp);
