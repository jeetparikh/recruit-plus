<?php
require_once('QuestionList.php');
require_once('QuestionType.php');
require_once('QuestionLevel.php');

$questionTypeId = isset($_GET['typeId']) ? $_GET['typeId'] : null;
$levelIds = isset($_GET['levelIds']) ? $_GET['levelIds'] : array();

$question = new QuestionList();
$questionType = new QuestionType();
$questionLevel = new QuestionLevel();
$resp = array();
$resp['questionList'] = $question->getAllQuestions($questionTypeId, $levelIds);
$resp['questionTypes'] = $questionType->getAllQuestionTypes();
$resp['questionLevels'] = $questionLevel->getAllquestionLevels();
$resp['questionTypeId'] = $questionTypeId;
$resp = json_encode($resp);
echo $_REQUEST['callback'].'('.$resp.')';
