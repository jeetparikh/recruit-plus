<?php

require_once('SendEmail.php');
header('content-type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
$from = $_POST['from'];
$to = $_POST['to'];
$subject = $_POST['subject'];
$message = $_POST['message'];
$email = new SendEmail();
$emailSent = $email->sendEmailToCandidate($to, $subject, $message, $from);
echo json_encode(array('sent' => $emailSent));