<?php

header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$questionTypeId = isset($_GET['typeId']) ? $_GET['typeId'] : null;
$levelIds = isset($_GET['levelIds']) ? $_GET['levelIds'] : array();

$question = new QuestionList();
$questionType = new QuestionType();
$questionLevel = new QuestionLevel();
$resp = array();
$resp['questionList'] = $question->getAllQuestions($questionTypeId, $levelIds);
$resp = json_encode($resp);
echo $_REQUEST['callback'].'('.$resp.')';
